import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderClosedIcon } from 'lucide-react'

import type { FlattenedItem } from './type'

import './SortableItemContent.css'

interface SortableItemContentProps {
  item: FlattenedItem
  onCollapse?: (collapsed: boolean) => void
}

export function SortableItemContent(props: SortableItemContentProps) {
  const { item, onCollapse } = props
  const { id, type, collapsed } = item

  return (
    <div className="SortableItemContent">
      <span
        className="icon"
        onClick={() => {
          onCollapse?.(!collapsed)
        }}
      >
        {type === 'folder' &&
          (collapsed ? (
            <ChevronRightIcon height="100%" width="100%" />
          ) : (
            <ChevronDownIcon height="100%" width="100%" />
          ))}
      </span>

      <span className="icon">
        {type === 'folder' ? (
          <FolderClosedIcon height="100%" width="100%" />
        ) : (
          <FileIcon height="100%" width="100%" />
        )}
      </span>

      <span>{id}</span>
    </div>
  )
}
