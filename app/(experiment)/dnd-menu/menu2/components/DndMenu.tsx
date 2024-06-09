'use client'

import { useState } from 'react'

import { SortableItem } from './SortableItem'
import { SortableList } from './SortableList'
import type { BaseItem } from './type'

const data = [
  { id: 1, level: 1, type: 'file' },
  { id: 2, level: 1, type: 'folder' },
  { id: 3, level: 2, type: 'file', parentId: 2 },
  { id: 4, level: 2, type: 'file', parentId: 2 },
  { id: 5, level: 1, type: 'file' },
  { id: 6, level: 1, type: 'folder' },
  { id: 7, level: 2, type: 'file', parentId: 6 },
  { id: 8, level: 2, type: 'file', parentId: 6 },
  { id: 9, level: 2, type: 'file', parentId: 6 },
] satisfies BaseItem[]

export function DndMenu() {
  const [items, setItems] = useState<BaseItem[]>(data)

  return (
    <SortableList
      items={items}
      renderItem={(item) => (
        <SortableItem item={item}>
          {item.id}
          <SortableList.DragHandle />
        </SortableItem>
      )}
      onChange={setItems}
    />
  )
}
