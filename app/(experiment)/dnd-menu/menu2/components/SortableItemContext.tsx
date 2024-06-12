import { createContext, useContext } from 'react'

import type { useSortable } from '@dnd-kit/sortable'

type UseSortable = ReturnType<typeof useSortable>

type Context = Pick<UseSortable, 'isDragging' | 'isOver'>

const SortableItemContext = createContext<Context>({} as Context)

export function SortableItemContextProvider(props: React.PropsWithChildren<{ value: Context }>) {
  const { children, value } = props

  return <SortableItemContext.Provider value={value}>{children}</SortableItemContext.Provider>
}

export function useSortableItemContext() {
  return useContext(SortableItemContext)
}
