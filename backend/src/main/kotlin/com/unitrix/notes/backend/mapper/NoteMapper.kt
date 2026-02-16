package com.unitrix.notes.backend.mapper

import com.unitrix.notes.backend.dto.GetAllNotesResponse
import com.unitrix.notes.backend.dto.GetNoteResponse
import com.unitrix.notes.backend.entities.NoteEntity
import org.springframework.data.domain.Page // <--- Import this!
import java.io.File

fun NoteEntity.toDto() = GetNoteResponse(
	id = this.id,
	title = this.title,
	content = this.content,
	tags = this.tags.map { it.tagName }.toList(),
	fileLocation = this.fileLocation?.let {
		"/uploads/images/${File(it).name}"
	},
	imgUrl = this.imgUrl,
	emoji = this.emoji,
	isLocked = this.isLocked,
	isTrashed = this.isTrashed,
	isPinned = this.isPinned,
	updatedAt = this.updatedAt.toString(),
	createdAt = this.createdAt.toString()
)

fun Page<NoteEntity>.toDto() = GetAllNotesResponse(
	content = this.content.map { it.toDto() },
	page = this.number,
	size = this.size,
	totalElements = this.totalElements,
	totalPages = this.totalPages,
	last = this.isLast
)
