import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderClosedIcon } from 'lucide-react'

import { useSortableItemContext } from './SortableItemContext'
import type { RenderProps } from './type'

import './SortableItemContent.css'

interface SortableItemContentProps extends RenderProps {
  onCollapse?: (collapsed: boolean) => void
  onClick?: () => void
}

export function SortableItemContent(props: SortableItemContentProps) {
  const { item, isSelected, isOverlay, onCollapse, onClick } = props
  const { id, type, collapsed } = item

  const { isDragging } = useSortableItemContext()

  const isFolder = type === 'folder'

  return (
    <div
      className={`SortableItemContent ${isDragging ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isOverlay ? 'overlay' : ''}`}
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /** @ts-ignore */
        '--level': item.depth,
      }}
      onClick={() => {
        onClick?.()
      }}
    >
      <div className="SortableItemContentInner">
        {isFolder ? (
          <span
            className="action-icon"
            onClick={() => {
              onCollapse?.(!collapsed)
            }}
          >
            {collapsed || isDragging ? (
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
