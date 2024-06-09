import { DndMenu } from './components/DndMenu'

export default function Menu2Page() {
  return (
    <div className="flex h-full justify-center bg-primary-50 p-8">
      <div className="h-full w-[256px] rounded-lg bg-contrary p-2">
        <DndMenu />
      </div>
    </div>
  )
}
