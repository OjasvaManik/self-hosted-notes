package com.unitrix.notes.backend.mapper

import com.unitrix.notes.backend.dto.GetAllTagsResponse
import com.unitrix.notes.backend.entities.TagEntity

fun List<TagEntity>.toDto() = GetAllTagsResponse(this.map { it.tagName })