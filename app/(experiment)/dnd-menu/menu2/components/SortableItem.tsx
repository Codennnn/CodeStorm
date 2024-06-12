import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { SortableItemContextProvider } from './SortableItemContext'
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
    isOver,

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    '--indent': `${16 * depth}px`,
  }

  return (
    <SortableItemContextProvider
      value={{
        isDragging,
        isOver,
      }}
    >
      <li ref={setNodeRef} className="SortableItem" style={style} {...attributes} {...listeners}>
        {children}
      </li>
    </SortableItemContextProvider>
  )
}
