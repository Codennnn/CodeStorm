'use client'

import { useState } from 'react'

import { ItemType } from './enums'
import { SortableItemContent } from './SortableItemContent'
import { SortableList } from './SortableList'
import type { TreeItem } from './types'
import { setProperty } from './utils'

const data = [
  {
    id: '111',
    type: ItemType.File,
  },
  {
    id: '222',
    type: ItemType.Folder,
    children: [
      { id: '222_111', type: ItemType.File },
      { id: '222_222', type: ItemType.File },
      { id: '222_333', type: ItemType.File },
      { id: '222_444', type: ItemType.File },
    ],
  },
  {
    id: '333',
    type: ItemType.Folder,
  },
  {
    id: '444',
    type: ItemType.Folder,
    children: [
      { id: '444_111', type: ItemType.File },
      { id: '444_222', type: ItemType.File },
    ],
  },
] satisfies TreeItem[]

export function DndMenu() {
  const [items, setItems] = useState<TreeItem[]>(data)
  const [selectedId, setSelectedId] = useState<TreeItem['id']>()

  return (
    <SortableList
      indentWidth={16}
      items={items}
      renderItem={({ item, ...restRenderProps }) => (
        <SortableItemContent
          item={item}
          {...restRenderProps}
          onCollapse={(collapsed) => {
            setItems(
              setProperty(items, item.id, 'collapsed', () => {
                return collapsed
              })
            )
          }}
          onSelect={() => {
            if (item.type === ItemType.File) {
              setSelectedId(item.id)
            }
          }}
        />
      )}
      selectedKey={selectedId}
      onChange={setItems}
    />
  )
}
