import { useMemo, useState } from 'react'

import { type Active, DndContext, type DndContextProps, type Over, useSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'

import { ItemType } from './enums'
import { SortableItem } from './SortableItem'
import { SortableOverlay } from './SortableOverlay'
import type { FlattenedItem, RenderProps, TreeItem } from './types'
import { buildTree, flattenTree, getProjection, PointerSensor, removeChildrenOf } from './utils'

import './SortableList.css'

interface SortableListProps {
  items: TreeItem[]
  selectedKey?: TreeItem['id']
  indentWidth?: number
  renderItem?: (renderProps: RenderProps) => React.ReactNode
  /** 是否禁用拖放。 */
  disabled?: boolean
  onChange?: (items: TreeItem[]) => void
}

export function SortableList(props: SortableListProps) {
  const { items, selectedKey, indentWidth = 16, renderItem, disabled, onChange } = props

  const [active, setActive] = useState<Active | null>(null)
  const activeId = active?.id

  const [over, setOver] = useState<Over | null>(null)
  const overId = over?.id

  const [offsetLeft, setOffsetLeft] = useState(0)

  const [sortableItems, flattenedTree] = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const clonedFlattenedTree: FlattenedItem[] = JSON.parse(JSON.stringify(flattenedTree))

    const collapsedItemIds = clonedFlattenedTree.reduce<FlattenedItem['id'][]>(
      (acc, { collapsed, id, type }) => {
        if (!!collapsed && type === ItemType.Folder) {
          return [...acc, id]
        }

        return acc
      },
      []
    )

    return [
      removeChildrenOf(
        clonedFlattenedTree,
        activeId ? [activeId, ...collapsedItemIds] : collapsedItemIds
      ),
      flattenedTree,
    ]
  }, [activeId, items])

  const activeItem = activeId ? sortableItems.find(({ id }) => id === activeId) : null

  const projected =
    activeId && overId
      ? getProjection({
          items: sortableItems,
          activeId,
          overId,
          dragOffset: offsetLeft,
          maxLevel: 2,
          indentWidth,
        })
      : null

  const resetState = () => {
    setOver(null)
    setActive(null)
    setOffsetLeft(0)
  }

  const handleDragEnd: DndContextProps['onDragEnd'] = ({ active, over }) => {
    resetState()

    if (projected && over) {
      const { level, parentId } = projected

      const overIndex = flattenedTree.findIndex(({ id }) => id === over.id)
      const activeIndex = flattenedTree.findIndex(({ id }) => id === active.id)
      const activeTreeItem = flattenedTree[activeIndex]

      flattenedTree[activeIndex] = { ...activeTreeItem, level, parentId }

      const sortedItems = arrayMove(flattenedTree, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      onChange?.(newItems)
    }
  }

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } })

  return (
    <DndContext
      sensors={[sensor]}
      onDragCancel={() => {
        resetState()
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
      <SortableContext disabled={disabled} items={sortableItems}>
        <ul
          className="SortableList"
          role="menu"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /** @ts-ignore */
            '--indent': `${indentWidth}px`,
          }}
        >
          {sortableItems.map((item) => {
            const isSelected = item.id === selectedKey

            return (
              <SortableItem key={item.id} item={item}>
                {renderItem?.({
                  item: {
                    ...item,
                    level: item.id === activeId && projected ? projected.level : item.level,
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
