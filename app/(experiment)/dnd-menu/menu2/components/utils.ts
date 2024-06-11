import { arrayMove } from '@dnd-kit/sortable'

import type { FlattenedItem, TreeItem } from './type'

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

export function findItem(items: TreeItem[], itemId: TreeItem['id']) {
  return items.find(({ id }) => id === itemId)
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItem[] {
  const root: TreeItem = { id: 'root', children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, children }
    parent.children?.push(item)
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

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection(
  items: FlattenedItem[],
  activeId: FlattenedItem['id'],
  overId: FlattenedItem['id'],
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  function getParentId(): FlattenedItem['parentId'] {
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
