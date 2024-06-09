import { createContext, useContext, useMemo } from 'react'

import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripIcon } from 'lucide-react'

import type { BaseItem } from './type'

import './SortableItem.css'

interface SortableItemProps {
  item: BaseItem
}

interface Context {
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  ref(node: HTMLElement | null): void
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref: () => void 0,
})

export function SortableItem(props: React.PropsWithChildren<SortableItemProps>) {
  const { children, item } = props
  const { id, type } = item

  const {
    isOver,
    isDragging,

    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,

    transform,
    transition,
  } = useSortable({ id })

  const isOverFolder = isOver && !isDragging && type === 'folder'
  if (isOverFolder) {
    console.log(isOver, id, 'isOver')
  }

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  )
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.6 : undefined,
    transform: isOverFolder ? undefined : CSS.Translate.toString(transform),
    transition: isOverFolder ? undefined : transition,
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} className="SortableItem" style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  )
}

export function DragHandle() {
  const { attributes, listeners } = useContext(SortableItemContext)

  return (
    <button className="DragHandle" {...attributes} {...listeners}>
      <GripIcon />
    </button>
  )
}
