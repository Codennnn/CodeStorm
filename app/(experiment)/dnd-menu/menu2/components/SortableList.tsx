import { type PointerEvent, useMemo, useState } from 'react'

import {
  type Active,
  DndContext,
  type DndContextProps,
  type Over,
  PointerSensor as LibPointerSensor,
  useSensor,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { SortableItem } from './SortableItem'
import { SortableItemContent } from './SortableItemContent'
import { SortableOverlay } from './SortableOverlay'
import type { FlattenedItem, TreeItem } from './type'
import { buildTree, flattenTree, getProjection, removeChildrenOf, setProperty } from './utils'

import './SortableList.css'

// Block DnD event propagation if element have "data-no-dnd" attribute.
const handler = ({ nativeEvent: event }: PointerEvent) => {
  let cur = event.target as HTMLElement

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (cur) {
    if (cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement!
  }

  return true
}

class PointerSensor extends LibPointerSensor {
  static activators = [
    { eventName: 'onPointerDown', handler },
  ] as (typeof LibPointerSensor)['activators']
}

interface SortableListProps {
  items: TreeItem[]
  onChange?: (items: TreeItem[]) => void
}

export function SortableList(props: SortableListProps) {
  const { items, onChange } = props

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
            <SortableItem key={item.id} item={item}>
              <SortableItemContent
                item={item}
                onCollapse={(collapsed) => {
                  onChange?.(
                    setProperty(items, item.id, 'collapsed', () => {
                      return collapsed
                    })
                  )
                }}
              />
            </SortableItem>
          ))}
        </ul>
      </SortableContext>

      <SortableOverlay>
        {activeItem ? <SortableItemContent item={activeItem} /> : null}
      </SortableOverlay>
    </DndContext>
  )
}
