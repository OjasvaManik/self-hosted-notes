package com.unitrix.notes.backend.services

import com.unitrix.notes.backend.dto.GetAllNotesRequest
import com.unitrix.notes.backend.entities.NoteEntity
import com.unitrix.notes.backend.entities.NoteRepo
import com.unitrix.notes.backend.entities.TagEntity
import com.unitrix.notes.backend.entities.TagRepo
import jakarta.persistence.criteria.JoinType
import jakarta.persistence.criteria.Predicate
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import java.util.*

@Service
class NoteService(
	private val noteRepo: NoteRepo,
	private val tagRepo: TagRepo,
	private val fileService: FileService,
	@Value("\${app.lock.password}")
	private val lockPassword: String,
) {

	fun save(note: NoteEntity) {
		noteRepo.save(note)
	}

	fun nullifyFileLocation(id: UUID) {
		fileService.deleteFile(noteRepo.findById(id).map { it.fileLocation }.orElse(null))
		noteRepo.findById(id).ifPresent { note ->
			note.fileLocation = null
			noteRepo.save(note)
		}
	}

	fun nullifyImgUrl(id: UUID) {
		noteRepo.findById(id).ifPresent { note ->
			note.imgUrl = null
			noteRepo.save(note)
		}
	}

	fun createNote(): UUID {
		val note = NoteEntity(
			title = "Untitled",
			content = ""
		)
		noteRepo.save(note)
		return note.id
	}

	fun getNote(id: UUID): NoteEntity? {
		return noteRepo.findById(id).orElse(null)
	}

	fun getAllNotes(request: GetAllNotesRequest): Page<NoteEntity> {
		// Ensure sort direction is valid
		val direction = if (request.direction == Sort.Direction.ASC) Sort.Direction.ASC else Sort.Direction.DESC
		val sort = Sort.by(direction, request.sortBy ?: "updatedAt")

		val pageable = PageRequest.of(request.page, request.size, sort)

		val spec = Specification<NoteEntity> { root, _, cb ->
			val predicates = mutableListOf<Predicate>()

			// 1. Handle Trash Status
			if (request.filterType == "trashed") {
				predicates.add(cb.isTrue(root.get("isTrashed")))
			} else {
				// By default, only show non-trashed notes
				predicates.add(cb.isFalse(root.get("isTrashed")))
			}

			// 2. Handle Pinned Status
			if (request.filterType == "pinned") {
				predicates.add(cb.isTrue(root.get("isPinned")))
			}

			// 3. Handle Tag Filters
			if (!request.filterTag.isNullOrBlank()) {
				val tagsJoin = root.join<NoteEntity, TagEntity>("tags", JoinType.INNER)
				predicates.add(cb.equal(tagsJoin.get<String>("tagName"), request.filterTag))
			}

			// 4. Handle Search
			if (!request.search.isNullOrBlank()) {
				val searchLower = "%${request.search.lowercase()}%"
				predicates.add(cb.like(cb.lower(root.get("title")), searchLower))
			}

			cb.and(*predicates.toTypedArray())
		}

		return noteRepo.findAll(spec, pageable)
	}

	fun getAllNotesForSearch(): List<NoteEntity> {
		return noteRepo.findAllByIsLockedFalseAndIsTrashedFalse()
	}

	fun getTrashedNotes() = noteRepo.findAllByIsTrashed(true).orEmpty()

	fun getLockedNotes() = noteRepo.findAllByIsLocked(true).orEmpty()

	fun getNoteTitle(id: UUID): String? {
		return noteRepo.findById(id).map { it.title }.orElse(null)
	}

	fun getNoteEmoji(id: UUID): String? {
		return noteRepo.findById(id).map { it.emoji }.orElse(null)
	}

	fun updateNote(id: UUID, title: String?, content: String?, tags: List<String>?): Boolean {
		val note = noteRepo.findById(id).orElse(null) ?: return false

		title?.let { note.title = it }
		content?.let { note.content = it }

		tags?.let { t ->
			note.tags = t.map { tagName ->
				val cleanName = tagName.trim().lowercase()
				tagRepo.findById(cleanName).orElseGet { TagEntity(cleanName) }
			}.toMutableSet()
		}

		noteRepo.save(note)
		return true
	}

	fun updateNoteTitle(id: UUID, title: String): NoteEntity? {
		val note = noteRepo.findById(id).orElse(null) ?: return null
		note.title = title
		return noteRepo.save(note)
	}

	fun updateNoteEmoji(id: UUID, emoji: String): NoteEntity? {
		val note = noteRepo.findById(id).orElse(null) ?: return null
		note.emoji = emoji
		return noteRepo.save(note)
	}

	fun updateNoteContent(id: UUID, content: String): NoteEntity? {
		val note = noteRepo.findById(id).orElse(null) ?: return null
		note.content = content
		return noteRepo.save(note)
	}

	fun updateNoteTags(id: UUID, tags: List<String>): NoteEntity? {
		val note = noteRepo.findById(id).orElse(null) ?: return null

		note.tags = tags.map { tagName ->
			val cleanName = tagName.trim().lowercase()
			tagRepo.findById(cleanName).orElseGet { TagEntity(cleanName) }
		}.toMutableSet()

		return noteRepo.save(note)
	}

	fun updateNoteImgUrl(id: UUID, imgUrl: String): NoteEntity {
		val note = noteRepo.findById(id)
			.orElseThrow { RuntimeException("Note not found") }
		if (note.fileLocation != null) {
			nullifyFileLocation(id)
		}
		note.imgUrl = imgUrl
		return noteRepo.save(note)
	}

	fun changePinStatus(id: UUID): Boolean {
		val note = noteRepo.findById(id).orElse(null) ?: return false
		note.isPinned = !note.isPinned
		noteRepo.save(note)
		return true
	}

	fun changeTrashStatus(id: UUID): Boolean {
		val note = noteRepo.findById(id).orElse(null) ?: return false
		note.isTrashed = !note.isTrashed
		noteRepo.save(note)
		return true
	}

	fun changeLockStatus(id: UUID): Boolean {
		val note = noteRepo.findById(id).orElse(null) ?: return false
		note.isLocked = !note.isLocked
		noteRepo.save(note)
		return true
	}

	fun deleteNote(id: UUID): Boolean {
		try {
			noteRepo.findById(id).orElseThrow().fileLocation?.let { fileService.deleteFile(it) }
			noteRepo.deleteById(id)
			return true
		} catch (e: Exception) {
			return false
		}
	}

	fun accessLockedNotesWithPassword(password: String): Boolean {
		print(lockPassword)
		return password == lockPassword
	}

}