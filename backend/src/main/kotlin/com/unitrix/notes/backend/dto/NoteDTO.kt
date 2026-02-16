package com.unitrix.notes.backend.dto

import org.springframework.data.domain.Sort
import java.util.*

data class CreateNoteResponse(
	val id: UUID
)

data class GetNoteResponse(
	val id: UUID,
	val title: String,
	val content: String,
	val tags: List<String>,
	val fileLocation: String?,
	val emoji: String?,
	val isLocked: Boolean,
	val isTrashed: Boolean,
	val isPinned: Boolean,
	val updatedAt: String,
	val createdAt: String
)

data class GetAllNotesRequest(
	val page: Int = 0,
	val size: Int = 10,
	val sortBy: String = "updatedAt",
	val direction: Sort.Direction = Sort.Direction.DESC,
	// Add these fields
	val search: String? = null,
	val filterTag: String? = null,
	val filterType: String? = null // 'pinned', 'trashed', 'all'
)

data class GetAllNotesResponse(
	val content: List<GetNoteResponse>,
	val page: Int,
	val size: Int,
	val totalElements: Long,
	val totalPages: Int,
	val last: Boolean
)

data class UpdateNoteRequest(
	val id: UUID,
	val title: String?,
	val content: String?,
	val emoji: String?,
	val tags: List<String>?,
	val isPinned: Boolean?,
	val isLocked: Boolean?,
	val isTrashed: Boolean?
)

data class UpdateNoteResponse(
	val isUpdated: Boolean
)

data class ChangeStatusRequest(
	val id: UUID,
)