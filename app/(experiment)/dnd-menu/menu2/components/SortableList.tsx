import { Fragment, useMemo, useState } from 'react'

import { type Active, DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { DragHandle } from './SortableItem'
import { SortableOverlay } from './SortableOverlay'
import type { BaseItem } from './type'

import './SortableList.css'

interface SortableListProps<T extends BaseItem> {
  items: T[]
  onChange?: (items: T[]) => void
  renderItem?: (item: T) => React.ReactNode
}

export function SortableList<T extends BaseItem>(props: SortableListProps<T>) {
  const { items, onChange, renderItem } = props

  const [active, setActive] = useState<Active | null>(null)

  const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items])

  const flattenedItems = useMemo(() => {
    if (activeItem) {
      return items.filter((it) => it.parentId !== activeItem.id)
    }

    return items
  }, [activeItem, items])

  return (
    <DndContext
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          const activeIndex = flattenedItems.findIndex(({ id }) => id === active.id)
          const overIndex = flattenedItems.findIndex(({ id }) => id === over.id)

          onChange?.(arrayMove(items, activeIndex, overIndex))
        }
        setActive(null)
      }}
      onDragStart={({ active }) => {
        setActive(active)
      }}
    >
      <SortableContext items={flattenedItems}>
        <ul className="SortableList" role="application">
          {flattenedItems.map((item) => (
            <Fragment key={item.id}>{renderItem?.(item)}</Fragment>
          ))}
        </ul>
      </SortableContext>

      <SortableOverlay>{activeItem ? renderItem?.(activeItem) : null}</SortableOverlay>
    </DndContext>
  )
}

SortableList.DragHandle = DragHandle
