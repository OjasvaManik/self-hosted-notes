package com.unitrix.notes.backend.entities

import com.unitrix.notes.backend.common.BaseTimeEntity
import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import java.util.*

@Entity
@Table(name = "notes")
class NoteEntity(

	@Id
	@Column(columnDefinition = "uuid", updatable = false, nullable = false, name = "note_id")
	val id: UUID = UUID.randomUUID(),

	@Column(nullable = false, name = "note_title")
	var title: String = "Untitled",

	@Column(name = "note_content")
	var content: String = "",

	@ManyToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE], fetch = FetchType.EAGER)
	@JoinTable(
		name = "note_tags",
		joinColumns = [JoinColumn(name = "note_id")],
		inverseJoinColumns = [JoinColumn(name = "tag_name")]
	)
	var tags: MutableSet<TagEntity> = mutableSetOf(),

	@Column(name = "file_location")
	val fileLocation: String? = null,

	@Column(name = "emoji")
	val emoji: String? = null,

	@Column(name = "is_locked")
	var isLocked: Boolean = false,

	@Column(name = "is_trashed")
	var isTrashed: Boolean = false,

	@Column(name = "is_pinned")
	var isPinned: Boolean = false,

	) : BaseTimeEntity()

interface NoteRepo : JpaRepository<NoteEntity, UUID>, JpaSpecificationExecutor<NoteEntity> {
	fun findAllByIsTrashed(isTrashed: Boolean): List<NoteEntity>
	fun findAllByIsLocked(isLocked: Boolean): List<NoteEntity>
}