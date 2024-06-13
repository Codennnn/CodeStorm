import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderClosedIcon } from 'lucide-react'

import { ItemType } from './enums'
import { useSortableItemContext } from './SortableItemContext'
import type { RenderProps } from './types'

import './SortableItemContent.css'

interface SortableItemContentProps extends RenderProps {
  onCollapse?: (collapsed: boolean) => void
  onSelect?: () => void
}

export function SortableItemContent(props: SortableItemContentProps) {
  const { item, isSelected, isOverlay, onCollapse, onSelect } = props
  const { id, type, collapsed } = item

  const { isDragging } = useSortableItemContext()

  const isFolder = type === ItemType.Folder

  return (
    <div
      className={`SortableItemContent ${isDragging ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isOverlay ? 'overlay' : ''}`}
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /** @ts-ignore */
        '--level': item.level - 1,
      }}
      onClick={() => {
        onSelect?.()
      }}
    >
      <div className="SortableItemContentInner">
        {isFolder ? (
          <span
            className="action-icon"
            onClick={(ev) => {
              ev.stopPropagation()

              onCollapse?.(!collapsed)
            }}
          >
            {collapsed || isDragging || isOverlay ? (
              <ChevronRightIcon height="100%" width="100%" />
            ) : (
              <ChevronDownIcon height="100%" width="100%" />
            )}
          </span>
        ) : (
          <span className="icon" />
        )}

        <span className="icon">
          {isFolder ? (
            <FolderClosedIcon height="100%" width="100%" />
          ) : (
            <FileIcon height="100%" width="100%" />
          )}
        </span>

        <span>{id}</span>
      </div>
    </div>
  )
}
