import { FileIcon, FolderClosedIcon } from 'lucide-react'

import type { FlattenedItem } from './type'

import './SortableItemContent.css'

interface SortableItemContentProps {
  item: FlattenedItem
}

export function SortableItemContent({ item }: SortableItemContentProps) {
  const { id, type } = item

  return (
    <div className="SortableItemContent">
      {type === 'folder' ? <FolderClosedIcon size={16} /> : <FileIcon size={16} />}
      {id}
    </div>
  )
}
