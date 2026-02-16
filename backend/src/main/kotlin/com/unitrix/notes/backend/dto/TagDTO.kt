package com.unitrix.notes.backend.dto

data class AddTagRequest (
	val tagName: String
)

data class AddTagResponse (
	val isAdded: Boolean
)

data class DeleteTagRequest (
	val tagName: String
)

data class DeleteTagResponse (
	val isDeleted: Boolean
)

data class GetAllTagsResponse (
	val tags: List<String>
)