import React from 'react'
import { getTagsAction } from "@/actions/actions"
import TagsView from "@/components/tags-view"

const TagsPage = async () => {
  const tags = await getTagsAction()

  return (
    <div className={ 'px-3 py-2' }>
      <h1 className={ 'font-bold uppercase border-b-2 pb-1 mb-1' }>Locked Notes</h1>
      <TagsView initialTags={ tags }/>
    </div>
  )
}

export default TagsPage