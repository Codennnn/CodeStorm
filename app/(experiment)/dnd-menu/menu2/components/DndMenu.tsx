'use client'

import { useState } from 'react'

import { SortableItemContent } from './SortableItemContent'
import { SortableList } from './SortableList'
import type { TreeItem } from './type'
import { setProperty } from './utils'

const data = [
  {
    id: '111',
  },
  {
    id: '222',
    children: [{ id: '222_111' }, { id: '222_222' }, { id: '222_333' }, { id: '222_444' }],
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
  const [selectedId, setSelectedId] = useState<TreeItem['id']>()

  return (
    <SortableList
      items={items}
      renderItem={({ item, ...restRenderProps }) => (
        <SortableItemContent
          item={item}
          {...restRenderProps}
          onClick={() => {
            setSelectedId(item.id)
          }}
          onCollapse={(collapsed) => {
            setItems(
              setProperty(items, item.id, 'collapsed', () => {
                return collapsed
              })
            )
          }}
        />
      )}
      selectedKey={selectedId}
      onChange={setItems}
    />
  )
}
