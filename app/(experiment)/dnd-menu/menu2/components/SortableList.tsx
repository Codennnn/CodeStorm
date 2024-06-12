import { useMemo, useState } from 'react'

import { type Active, DndContext, type DndContextProps, type Over, useSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { SortableItem } from './SortableItem'
import { SortableOverlay } from './SortableOverlay'
import type { FlattenedItem, RenderProps, TreeItem } from './type'
import { buildTree, flattenTree, getProjection, PointerSensor, removeChildrenOf } from './utils'

import './SortableList.css'

interface SortableListProps {
  items: TreeItem[]
  selectedKey?: TreeItem['id']
  renderItem?: (renderProps: RenderProps) => React.ReactNode
  onChange?: (items: TreeItem[]) => void
}

export function SortableList(props: SortableListProps) {
  const { items, selectedKey, renderItem, onChange } = props

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

  const projected =
    activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, 16) : null

  const resetState = () => {
    setOver(null)
    setActive(null)
    setOffsetLeft(0)
  }

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

      onChange?.(newItems)
    }
  }

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } })

  return (
    <DndContext
      sensors={[sensor]}
      onDragCancel={() => {
        setActive(null)
      }}
      onDragEnd={handleDragEnd}
      onDragMove={({ delta }) => {
        setOffsetLeft(delta.x)
      }}
      onDragOver={({ over }) => {
        setOver(over)
      }}
      onDragStart={({ active }) => {
        setActive(active)
      }}
    >
      <SortableContext items={flattenedItems}>
        <ul className="SortableList" role="menu">
          {flattenedItems.map((item) => {
            const isSelected = item.id === selectedKey

            return (
              <SortableItem key={item.id} item={item}>
                {renderItem?.({
                  item: {
                    ...item,
                    depth: item.id === activeId && projected ? projected.depth : item.depth,
                  },
                  isSelected,
                })}
              </SortableItem>
            )
          })}
        </ul>
      </SortableContext>

      <SortableOverlay>
        {activeItem ? renderItem?.({ item: activeItem, isOverlay: true }) : null}
      </SortableOverlay>
    </DndContext>
  )
}
