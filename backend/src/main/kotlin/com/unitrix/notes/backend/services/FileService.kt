package com.unitrix.notes.backend.services

import org.springframework.stereotype.Service
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*

@Service
class FileService {

	private val baseDir: Path =
		Paths.get("/home/ojasva/Projects/notes-app/data/uploads")

	private val imagesDir: Path = baseDir.resolve("images")
	private val tempDir: Path = baseDir.resolve("temp")

	init {
		Files.createDirectories(imagesDir)
		Files.createDirectories(tempDir)
	}

	fun handleUpload(file: File, originalFilename: String, mimeType: String): String {

		val uniqueName = "${UUID.randomUUID()}-${originalFilename}"
		val tempInput = tempDir.resolve(uniqueName).toFile()
		file.copyTo(tempInput, overwrite = true)

		val isVideo = mimeType.startsWith("video/")

		if (!isVideo) {
			val finalPath = imagesDir.resolve(uniqueName)
			Files.move(tempInput.toPath(), finalPath)
			return finalPath.toAbsolutePath().toString()
		}

		// VIDEO → GIF
		val gifName = uniqueName.substringBeforeLast(".") + ".gif"
		val gifPath = imagesDir.resolve(gifName)
		val palettePath = tempDir.resolve("$uniqueName.palette.png")

		generateGif(tempInput, gifPath.toFile(), palettePath.toFile())

		tempInput.delete()
		palettePath.toFile().delete()

		return gifPath.toAbsolutePath().toString()
	}

	fun deleteFile(path: String?) {
		try {
			Files.deleteIfExists(Paths.get(path))
		} catch (e: Exception) {
			println("Failed to delete old file: $path")
		}
	}

	private fun generateGif(input: File, output: File, palette: File) {

		val paletteCmd = listOf(
			"ffmpeg", "-y",
			"-i", input.absolutePath,
			"-vf", "fps=12,scale=480:-1:flags=lanczos,palettegen",
			palette.absolutePath
		)

		val gifCmd = listOf(
			"ffmpeg", "-y",
			"-i", input.absolutePath,
			"-i", palette.absolutePath,
			"-filter_complex",
			"fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer",
			output.absolutePath
		)

		runCommand(paletteCmd)
		runCommand(gifCmd)
	}

	private fun runCommand(command: List<String>) {
		val process = ProcessBuilder(command)
			.redirectErrorStream(true)
			.start()

		val exitCode = process.waitFor()

		if (exitCode != 0) {
			throw RuntimeException("FFmpeg failed with exit code $exitCode")
		}
	}
}
