import type { WorkId } from '@violet/lib/types/branded'
import type { DragItemType } from '@violet/web/src/types/dragTab'
import type { PropsWithChildren } from 'react'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'

const DragItem = styled.div<{
  isDragging?: boolean
}>`
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
`

type ComponentProps = PropsWithChildren<{
  workId: WorkId
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  setHoverItem: (value: React.SetStateAction<WorkId | 'EmptyArea' | null>) => void
}>

export const itemType = 'work'

export const Draggable = ({ children, workId, index, onMove, setHoverItem }: ComponentProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: itemType,
    hover() {
      setHoverItem(workId)
    },
    drop(item: DragItemType) {
      onMove(item.index, index)
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { workId, index },
    type: itemType,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(drop(ref))
  return (
    <DragItem ref={ref} isDragging={isDragging}>
      {children}
    </DragItem>
  )
}
