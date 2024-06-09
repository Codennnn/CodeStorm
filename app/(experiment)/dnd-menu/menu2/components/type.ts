import type { UniqueIdentifier } from '@dnd-kit/core'

export interface BaseItem {
  id: UniqueIdentifier
  level: 1 | 2
  type: 'folder' | 'file'
  parentId?: BaseItem['id']
}
