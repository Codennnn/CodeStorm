import { defaultDropAnimationSideEffects, DragOverlay, type DropAnimation } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.6',
      },
    },
  }),
}

export function SortableOverlay(props: React.PropsWithChildren) {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{props.children}</DragOverlay>
}
