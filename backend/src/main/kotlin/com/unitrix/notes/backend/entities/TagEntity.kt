package com.unitrix.notes.backend.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository

@Entity
@Table(name = "tags")
class TagEntity (

	@Id
	@Column(name = "tag_name")
	val tagName: String = "",

)

interface TagRepo: JpaRepository<TagEntity, String> {
	fun findByTagNameContainingIgnoreCase(name: String): List<TagEntity>
}