import type { PointerEvent } from 'react'

import { PointerSensor as LibPointerSensor } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { ItemType } from './enums'
import type { FlattenedItem, TreeItem } from './types'

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

export class PointerSensor extends LibPointerSensor {
  static activators = [
    { eventName: 'onPointerDown', handler },
  ] as (typeof LibPointerSensor)['activators']
}

function flatten(
  items: TreeItem['children'],
  parentId?: TreeItem['id'],
  level = 1
): FlattenedItem[] {
  if (Array.isArray(items)) {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
      return [
        ...acc,
        {
          ...item,
          parentId,
          level,
          index,
        },
        ...flatten(item.children, item.id, level + 1),
      ]
    }, [])
  }

  return []
}

export function flattenTree(items: TreeItem[]): FlattenedItem[] {
  return flatten(items)
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItem[] {
  const root: TreeItem = { id: 'root', type: ItemType.Folder, children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map<FlattenedItem>((item) => ({
    ...item,
    children: [],
  }))

  for (const item of items) {
    const { id, type, children } = item

    const parentId = item.parentId ?? root.id
    const parent = parentId ? nodes[parentId] ?? items.find((it) => it.id === parentId) : undefined

    nodes[id] = { id, type, children }

    if (parent) {
      if (Array.isArray(parent.children)) {
        parent.children.push(item)
      } else {
        parent.children = [item]
      }
    }
  }

  return root.children!
}

export function removeChildrenOf(items: FlattenedItem[], ids: FlattenedItem['id'][]) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (previousItem) {
    return previousItem.level + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (nextItem) {
    return nextItem.level
  }

  return 0
}

function getDragDepth(offset: number, indentWidth: number) {
  return Math.round(offset / indentWidth)
}

export function getProjection({
  items,
  activeId,
  overId,
  maxLevel: maxLevelX,
  dragOffset,
  indentWidth,
}: {
  items: FlattenedItem[]
  activeId: FlattenedItem['id']
  overId: FlattenedItem['id']
  maxLevel?: number
  dragOffset: number
  indentWidth: number
}) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]

  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]

  const maxLevel =
    activeItem.type === ItemType.Folder ||
    (previousItem.type === ItemType.File && !previousItem.parentId)
      ? 1
      : maxLevelX || getMaxDepth({ previousItem })
  const minLevel = getMinDepth({ nextItem })

  const dragLevel = getDragDepth(dragOffset, indentWidth)
  const projectedLevel = activeItem.level + dragLevel

  let level = projectedLevel

  if (projectedLevel >= maxLevel) {
    level = maxLevel
  } else if (projectedLevel < minLevel) {
    level = minLevel
  }

  const getParentId = (): FlattenedItem['parentId'] => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (level === 0 || !previousItem) {
      return undefined
    }

    if (level === previousItem.level) {
      return previousItem.parentId
    }

    if (level > previousItem.level) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.level === level)?.parentId

    return newParent
  }

  return { level, maxLevel, minDepth: minLevel, parentId: getParentId() }
}

export function setProperty<T extends keyof TreeItem>(
  items: TreeItem[],
  id: TreeItem['id'],
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children = setProperty(item.children, id, property, setter)
    }
  }

  return [...items]
}
