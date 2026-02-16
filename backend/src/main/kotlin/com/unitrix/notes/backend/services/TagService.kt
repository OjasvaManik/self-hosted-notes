package com.unitrix.notes.backend.services

import com.unitrix.notes.backend.entities.TagEntity
import com.unitrix.notes.backend.entities.TagRepo
import org.springframework.stereotype.Service

@Service
class TagService (
	private val tagRepo: TagRepo
) {

	fun addTag(tagName: String): Boolean {
		if (tagRepo.existsById(tagName)) {
			return false
		}
		tagRepo.save(TagEntity(tagName))
		return true // Created new tag
	}

	fun deleteTag(tagName: String): Boolean {
		try {
			tagRepo.deleteById(tagName)
			return true
		} catch (e: Exception) {
			return false
		}
	}

	fun getAllTags(): List<TagEntity> {
		return tagRepo.findAll()
	}

}