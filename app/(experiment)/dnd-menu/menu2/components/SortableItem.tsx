import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { FlattenedItem } from './type'

import './SortableItem.css'

interface SortableItemProps {
  item: FlattenedItem
}

export function SortableItem(props: React.PropsWithChildren<SortableItemProps>) {
  const { children, item } = props
  const { id, depth } = item

  const {
    isDragging,

    attributes,
    listeners,
    setNodeRef,

    transform,
    transition,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Translate.toString(transform),
    transition: transition,
    '--indent': `${16 * depth}px`,
  }

  return (
    <li ref={setNodeRef} className="SortableItem" style={style} {...attributes} {...listeners}>
      {children}
    </li>
  )
}
