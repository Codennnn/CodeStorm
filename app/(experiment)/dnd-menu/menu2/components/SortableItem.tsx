import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { SortableItemContextProvider } from './SortableItemContext'
import type { FlattenedItem } from './type'

interface SortableItemProps {
  item: FlattenedItem
}

export function SortableItem(props: React.PropsWithChildren<SortableItemProps>) {
  const { children, item } = props

  const {
    isDragging,
    isOver,

    attributes,
    listeners,
    setNodeRef,

    transform,
    transition,
  } = useSortable({ id: item.id })

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Translate.toString(transform),
    transition: transition,
  }

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SortableItemContextProvider
        value={{
          isDragging,
          isOver,
        }}
      >
        {children}
      </SortableItemContextProvider>
    </li>
  )
}
