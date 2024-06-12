import type { PointerEvent } from 'react'

import { PointerSensor as LibPointerSensor } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import type { FlattenedItem, TreeItem } from './type'

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
  depth = 0
): FlattenedItem[] {
  if (Array.isArray(items)) {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
      return [
        ...acc,
        {
          ...item,
          parentId,
          depth,
          index,
          type: Array.isArray(item.children) && item.children.length > 0 ? 'folder' : 'file',
        },
        ...flatten(item.children, item.id, depth + 1),
      ]
    }, [])
  }

  return []
}

export function flattenTree(items: TreeItem[]): FlattenedItem[] {
  return flatten(items)
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItem[] {
  const root: TreeItem = { id: 'root', children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map<FlattenedItem>((item) => ({
    ...item,
    children: [],
  }))

  for (const item of items) {
    const { id, children } = item

    const parentId = item.parentId ?? root.id
    const parent = parentId ? nodes[parentId] ?? items.find((it) => it.id === parentId) : undefined

    nodes[id] = { id, children }

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
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth
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
  maxDepth: maxLevel,
  dragOffset,
  indentWidth,
}: {
  items: FlattenedItem[]
  activeId: FlattenedItem['id']
  overId: FlattenedItem['id']
  maxDepth?: number
  dragOffset: number
  indentWidth: number
}) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]

  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]

  const maxDepth =
    activeItem.type === 'folder' || (previousItem.type === 'file' && !previousItem.parentId)
      ? 0
      : maxLevel || getMaxDepth({ previousItem })
  const minDepth = getMinDepth({ nextItem })

  const dragDepth = getDragDepth(dragOffset, indentWidth)
  const projectedDepth = activeItem.depth + dragDepth

  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  const getParentId = (): FlattenedItem['parentId'] => {
    if (depth === 0 || !previousItem) {
      return undefined
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }
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
