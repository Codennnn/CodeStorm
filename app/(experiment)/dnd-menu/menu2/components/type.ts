import type { UniqueIdentifier } from '@dnd-kit/core'

export interface TreeItem {
  id: UniqueIdentifier
  children?: TreeItem[]
  collapsed?: boolean
}

export interface FlattenedItem extends TreeItem {
  parentId?: TreeItem['id']
  depth: number
  index: number
  type: 'folder' | 'file'
}
