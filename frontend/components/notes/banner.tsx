import Image from "next/image"
import UploadFile from "@/components/notes/upload-file"
import RemoveFile from "@/components/notes/remove-file"

type Props = {
  fileLocation?: string | null
  noteId: string
}

const Banner = ( { fileLocation, noteId }: Props ) => {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_API_URL

  if ( !fileLocation ) {
    return (
      <div className="flex h-16 w-full items-center justify-center border-b border-border bg-secondary">
        <UploadFile noteId={ noteId }/>
      </div>
    )
  }

  return (
    <div className="group relative h-72 w-full border-b border-border">
      <Image
        src={ `${ baseUrl }${ fileLocation }` }
        alt="banner"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />

      <div
        className="absolute right-4 top-4 z-10 flex gap-2 lg:opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <UploadFile noteId={ noteId }/>
        <RemoveFile noteId={ noteId }/>
      </div>
    </div>
  )
}

export default Banner