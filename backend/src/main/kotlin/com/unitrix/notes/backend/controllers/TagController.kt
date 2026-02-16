package com.unitrix.notes.backend.controllers

import com.unitrix.notes.backend.dto.*
import com.unitrix.notes.backend.mapper.toDto
import com.unitrix.notes.backend.services.TagService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/tags")
class TagController(
	private val tagService: TagService
) {

	@GetMapping("/all")
	fun getAllTags(): ResponseEntity<GetAllTagsResponse> {
		return ResponseEntity.ok(tagService.getAllTags().toDto())
	}

	@PostMapping("/add")
	fun addTag(@RequestBody tag: AddTagRequest): ResponseEntity<AddTagResponse> {
		val createdTag = tagService.addTag(tag.tagName)
		return ResponseEntity
			.status(HttpStatus.CREATED)
			.body(AddTagResponse(createdTag))
	}

	@DeleteMapping("/delete")
	fun deleteTag(@RequestBody tag: DeleteTagRequest): ResponseEntity<DeleteTagResponse> {
		val result = tagService.deleteTag(tag.tagName)
		return ResponseEntity.ok(DeleteTagResponse(result))
	}

}