package com.unitrix.notes.backend.controllers

import com.unitrix.notes.backend.dto.*
import com.unitrix.notes.backend.mapper.toDto
import com.unitrix.notes.backend.services.NoteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/notes")
class NoteController(
	private val noteService: NoteService
) {

	@GetMapping("/all")
	fun getAllNotes(@ModelAttribute request: GetAllNotesRequest): ResponseEntity<GetAllNotesResponse> {
		val response = noteService.getAllNotes(request).toDto()
		return ResponseEntity.ok(response)
	}

	@GetMapping("/search")
	fun getAllNotesForSearch(): ResponseEntity<List<GetNoteResponse>> {
		val notes = noteService.getAllNotesForSearch().map { it.toDto() }
		return ResponseEntity.ok(notes)
	}

	@PostMapping("/create")
	fun createNote(): ResponseEntity<CreateNoteResponse> {
		val note = noteService.createNote()
		return ResponseEntity
			.status(HttpStatus.CREATED)
			.body(CreateNoteResponse(note))
	}

	@GetMapping("/{id}")
	fun getNote(@PathVariable id: UUID): ResponseEntity<GetNoteResponse> {
		val noteDto = noteService.getNote(id)?.toDto()

		return if (noteDto != null) {
			ResponseEntity.ok(noteDto)
		} else {
			ResponseEntity.notFound().build()
		}
	}

	@GetMapping("/trashed")
	fun getTrashedNotes(): ResponseEntity<List<GetNoteResponse>> {
		val notes = noteService.getTrashedNotes().map { it.toDto() }
		return ResponseEntity.ok(notes)
	}

	@GetMapping("/locked")
	fun getLockedNotes(): ResponseEntity<List<GetNoteResponse>> {
		val notes = noteService.getLockedNotes().map { it.toDto() }
		return ResponseEntity.ok(notes)
	}

	@GetMapping("/title/{id}")
	fun getNoteTitle(@PathVariable id: UUID): ResponseEntity<String> {
		val title = noteService.getNoteTitle(id)
		return ResponseEntity.ok(title)
	}

	@PatchMapping("/update")
	fun updateNote(@RequestBody note: UpdateNoteRequest): ResponseEntity<UpdateNoteResponse> {
		val updatedNote = noteService.updateNote(note.id, note.title, note.content, note.tags)
		return ResponseEntity.ok(UpdateNoteResponse(updatedNote))
	}

	@PatchMapping("/pin")
	fun changePinStatus(@RequestBody request: ChangeStatusRequest): ResponseEntity<Boolean> {
		return ResponseEntity.ok(noteService.changePinStatus(request.id))
	}

	@PatchMapping("/lock")
	fun changeLockStatus(@RequestBody request: ChangeStatusRequest): ResponseEntity<Boolean> {
		return ResponseEntity.ok(noteService.changeLockStatus(request.id))
	}

	@PatchMapping("/trash")
	fun changeTrashStatus(@RequestBody request: ChangeStatusRequest): ResponseEntity<Boolean> {
		return ResponseEntity.ok(noteService.changeTrashStatus(request.id))
	}

	@DeleteMapping("/delete")
	fun deleteNoteAction(@RequestBody request: ChangeStatusRequest): ResponseEntity<Boolean> {
		val deleted = noteService.deleteNote(request.id)
		return if (deleted) {
			ResponseEntity.ok(true)
		} else {
			ResponseEntity.notFound().build()
		}
	}

	@PostMapping("/unlock")
	fun unlockNotes(@RequestBody payload: Map<String, String>): ResponseEntity<Boolean> {
		val password = payload["password"] ?: ""
		return if (noteService.accessLockedNotesWithPassword(password)) {
			ResponseEntity.ok(true)
		} else {
			ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false)
		}
	}
}