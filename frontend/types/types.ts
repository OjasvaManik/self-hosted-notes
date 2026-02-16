// types.ts
export type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  fileLocation?: string
  emoji?: string
  isLocked: boolean
  isTrashed: boolean
  isPinned: boolean
  updatedAt?: string
  createdAt?: string
}

export type CreateNoteResponse = {
  id: string
}

export type GetAllNotesRequest = {
  page?: number
  size?: number
  sortBy?: string
  direction?: "ASC" | "DESC"
  search?: string
  filterTag?: string
  filterType?: string
}
// ... existing types

export type GetAllNotesResponse = {
  content: Note[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type GetAllTagsResponse = {
  tags: string[]
}

export type AddTagRequest = { tagName: string }
export type AddTagResponse = { isAdded: boolean }

export type ChangeStatusRequest = { id: String }