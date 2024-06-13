import type { UniqueIdentifier } from '@dnd-kit/core'

import type { ItemType } from './enums'

export interface TreeItem {
  id: UniqueIdentifier
  type: ItemType
  children?: TreeItem[]
  collapsed?: boolean
}

export interface FlattenedItem extends TreeItem {
  parentId?: TreeItem['id']
  level: number
  index: number
}

export interface RenderProps {
  item: FlattenedItem
  isSelected?: boolean
  isOverlay?: boolean
}
