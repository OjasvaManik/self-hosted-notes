package com.unitrix.notes.backend.controllers

import com.unitrix.notes.backend.services.FileService
import com.unitrix.notes.backend.services.NoteService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

@RestController
@RequestMapping("/api/v1/files")
class FileController(
	private val fileService: FileService,
	private val noteService: NoteService,
) {

	@PostMapping("/upload")
	fun uploadFile(
		@RequestParam("file") file: MultipartFile,
		@RequestParam("noteId") noteId: UUID
	): ResponseEntity<Map<String, String>> {
		val note = noteService.getNote(noteId)
			?: return ResponseEntity.notFound().build()

		if (note.imgUrl != null) {
			noteService.nullifyImgUrl(noteId)
		}

		val contentType = file.contentType
			?: return ResponseEntity.badRequest()
				.body(mapOf("error" to "Missing content type"))

		if (!contentType.startsWith("image/") &&
			!contentType.startsWith("video/")
		) {
			return ResponseEntity.badRequest()
				.body(mapOf("error" to "Unsupported file type"))
		}

		val oldPath = note.fileLocation
		val tempFile = File.createTempFile("upload-", file.originalFilename)
		file.transferTo(tempFile)

		val fullPath = fileService.handleUpload(
			tempFile,
			file.originalFilename ?: "file",
			contentType
		)

		tempFile.delete()
		oldPath?.let {
			fileService.deleteFile(it)
		}
		try {
			note.fileLocation = fullPath
			noteService.save(note)
		} catch (e: Exception) {
			println("CRITICAL DB SAVE ERROR: ${e.message}")
			e.printStackTrace()
			return ResponseEntity.internalServerError().body(mapOf("error" to "Database save failed"))
		}

		val publicUrl = "/uploads/images/${File(fullPath).name}"
		return ResponseEntity.ok(
			mapOf("fileLocation" to publicUrl)
		)
	}

	@DeleteMapping("/delete")
	fun deleteFile(@RequestBody noteId: UUID): ResponseEntity<Boolean> {
		val note = noteService.getNote(noteId)
			?: return ResponseEntity.notFound().build()

		if (note.imgUrl != null) {
			noteService.nullifyImgUrl(noteId)
			return ResponseEntity.ok(true)
		}

		fileService.deleteFile(note.fileLocation)
		note.fileLocation = null
		noteService.save(note)
		return ResponseEntity.ok(true)
	}
}
