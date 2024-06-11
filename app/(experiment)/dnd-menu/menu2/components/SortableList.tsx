import { Fragment, useMemo, useState } from 'react'

import { type Active, DndContext, type DndContextProps, type Over } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { SortableOverlay } from './SortableOverlay'
import type { FlattenedItem, TreeItem } from './type'
import { buildTree, flattenTree, getProjection, removeChildrenOf } from './utils'

import './SortableList.css'

interface SortableListProps<T extends TreeItem> {
  items: T[]
  onChange?: (items: T[]) => void
  renderItem?: (item: FlattenedItem) => React.ReactNode
}

export function SortableList<T extends TreeItem>(props: SortableListProps<T>) {
  const { items, onChange, renderItem } = props

  const [active, setActive] = useState<Active | null>(null)
  const activeId = active?.id

  const [over, setOver] = useState<Over | null>(null)
  const overId = over?.id

  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)

    const collapsedItemIds = flattenedTree.reduce<FlattenedItem['id'][]>(
      (acc, { children, collapsed, id }) =>
        !!collapsed && Array.isArray(children) && children.length > 0 ? [...acc, id] : acc,
      []
    )

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItemIds] : collapsedItemIds
    )
  }, [activeId, items])

  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null

  function resetState() {
    setOver(null)
    setActive(null)
    setOffsetLeft(0)
  }

  const projected =
    activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, 16) : null

  const handleDragEnd: DndContextProps['onDragEnd'] = ({ active, over }) => {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)))
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      onChange?.(newItems as T[])
    }
  }

  return (
    <DndContext
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={handleDragEnd}
      onDragOver={({ over }) => {
        setOver(over)
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
