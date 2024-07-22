'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { GridLayout } from './GridLayout'

export default function GridLayoutPage() {
  return (
    <PanelGroup direction="horizontal" id="panel-group">
      <Panel maxSize={80} minSize={20}>
        <GridLayout />
      </Panel>

      <PanelResizeHandle className={`relative basis-5 hover:bg-green-100`}>
        <div className="h-full w-px" />
      </PanelResizeHandle>

      <Panel>
        <div className="h-full bg-slate-100">123</div>
      </Panel>
    </PanelGroup>
  )
}
