'use client'

import { forwardRef, useState } from 'react'

import {
  SimpleTreeItemWrapper,
  SortableTree,
  type TreeItemComponentProps,
  type TreeItems,
} from 'dnd-kit-sortable-tree'

interface TreeItemData {
  value: string
}

const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<TreeItemData>>(
  function x(props, ref) {
    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <div>{props.item.value}</div>
      </SimpleTreeItemWrapper>
    )
  }
)

const initData: TreeItems<TreeItemData> = [
  {
    id: '1',
    value: 'Jane',
    children: [
      { id: '4', value: 'John' },
      { id: '5', value: 'Sally' },
    ],
  },
  { id: '2', value: 'Fred', children: [{ id: '6', value: 'Eugene' }] },
  { id: '3', value: 'Helen', canHaveChildren: false },
]

export function DndMenu() {
  const [items, setItems] = useState(initData)

  return (
    <SortableTree TreeItemComponent={TreeItemComponent} items={items} onItemsChanged={setItems} />
  )
}
