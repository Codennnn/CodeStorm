/* eslint-disable react/no-unknown-property */
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button, Input, Select, Space } from 'antd'
import { type ColumnOptions, GridStack } from 'gridstack'

import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import './GridLayout.css'

const removeDOM = false

interface GridItem {
  id?: string | number
  x: number
  y: number
  w?: number
  h?: number
}

const GRID_ITEMS: GridItem[] = [
  { x: 0, y: 0, w: 6, h: 1 },
  { x: 6, y: 0, w: 6, h: 1 },
  { x: 0, y: 2, w: 4, h: 1 },
  { x: 4, y: 2, w: 4, h: 1 },
  { x: 8, y: 2, w: 4, h: 1 },
  { x: 1, y: 4, w: 4, h: 1 },
  { x: 5, y: 4, w: 2 },
  { x: 0, y: 4, w: 12 },
]

const LAYOUT: ColumnOptions = 'moveScale'

export function GridLayout() {
  const gridRoot = useRef<HTMLDivElement>(null)
  const gridStack = useRef<GridStack>()

  const [gridItems, setGridItems] = useState<GridItem[]>()
  const [cols, setCols] = useState(12)

  useEffect(() => {
    setGridItems(
      GRID_ITEMS.map((it, idx) => {
        return {
          ...it,
          id: idx,
        }
      })
    )
  }, [])

  useLayoutEffect(() => {
    if (gridItems && gridRoot.current) {
      gridStack.current = GridStack.init(
        {
          column: 12,
          cellHeight: 80,
          animate: false,
          sizeToContent: false,
          columnOpts: {
            layout: LAYOUT,
            // columnMax: 24,
            breakpointForWindow: false,
            breakpoints: [
              { w: 390, c: 1 },
              { w: 400, c: 2 },
              { w: 500, c: 3 },
              { w: 600, c: 4 },
              { w: 800, c: 6 },
              { w: 1000, c: 8 },
              { w: 1200, c: 10 },
            ],
          },
          float: true,
        },
        gridRoot.current
      ).on('change', () => {
        const currentCols = gridStack.current?.getColumn()

        if (typeof currentCols === 'number') {
          setCols(currentCols)
        }
      })

      return () => {
        gridStack.current?.destroy(removeDOM)
      }
    }
  }, [gridItems])

  return (
    <div>
      <div>
        <Space>
          <Button
            onClick={() => {
              setGridItems((prev) => {
                if (prev) {
                  return [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      x: 0,
                      y: 0,
                    },
                  ]
                }

                return undefined
              })
            }}
          >
            增加
          </Button>

          <Button
            onClick={() => {
              gridStack.current?.setStatic(true)
            }}
          >
            Static
          </Button>

          <Select
            options={Array.from({ length: 12 }).map((_, idx) => {
              const col = idx + 1
              return { value: col, label: col }
            })}
            value={cols}
            onChange={setCols}
          />
        </Space>
      </div>

      <div ref={gridRoot}>
        {gridItems?.map((it) => {
          return (
            <div
              key={it.id}
              // ref={(node) => {
              //   refs.current[it.id] = node
              // }}
              className={`grid-stack-item`}
              gs-h={it.h}
              gs-w={it.w}
              gs-x={it.x}
              gs-y={it.y}
            >
              <div className={`grid-stack-item-content p-2`}>
                <Input placeholder={String(it.id)} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
