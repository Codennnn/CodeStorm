'use client'

import { useState } from 'react'

import { SortableItem } from './SortableItem'
import { SortableItemContent } from './SortableItemContent'
import { SortableList } from './SortableList'
import type { TreeItem } from './type'

const data = [
  {
    id: '111',
  },
  {
    id: '222',
    children: [{ id: '222_111' }, { id: '222_222' }, { id: '222_333' }, { id: 'Winter' }],
  },
  {
    id: '333',
  },
  {
    id: '444',
    children: [{ id: '444_111' }, { id: '444_222' }],
  },
] satisfies TreeItem[]

export function DndMenu() {
  const [items, setItems] = useState<TreeItem[]>(data)

  return (
    <SortableList
      items={items}
      renderItem={(item) => (
        <SortableItem item={item}>
          <SortableItemContent item={item} />
        </SortableItem>
      )}
      onChange={setItems}
    />
  )
}
