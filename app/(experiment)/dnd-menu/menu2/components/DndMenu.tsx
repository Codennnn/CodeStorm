'use client'

import { useState } from 'react'

import { SortableList } from './SortableList'

export function DndMenu() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 10 }).map((_, idx) => ({ id: idx }))
  )

  return (
    <SortableList
      items={items}
      renderItem={(item) => (
        <SortableList.Item id={item.id}>
          {item.id}
          <SortableList.DragHandle />
        </SortableList.Item>
      )}
      onChange={setItems}
    />
  )
}
