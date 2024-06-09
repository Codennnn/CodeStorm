import { DndMenu } from './components/DndMenu'

export default function Menu2Page() {
  return (
    <div className="flex h-full justify-center overflow-y-auto bg-primary-50 p-8">
      <div className="h-full w-[256px] overflow-hidden rounded-lg bg-contrary">
        <div className="h-full overflow-y-auto overflow-x-hidden p-4">
          <DndMenu />
        </div>
      </div>
    </div>
  )
}
