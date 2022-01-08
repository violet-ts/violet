import type { WorkId } from '@violet/lib/types/branded'
import type { DragItemType } from '@violet/web/src/types/dragTab'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'

const DragItem = styled.div<{
  isDragging?: boolean
  canDrag?: boolean
}>`
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
`

interface Props {
  children?: React.ReactNode
  workId: WorkId
  index: number
  itemType: 'work'
  onMove: (dragIndex: number, hoverIndex: number) => void
  changeStyleOfHoverItem: (hoverItem: WorkId) => void
}

export const Draggable: React.FC<Props> = ({
  children,
  workId,
  itemType,
  index,
  onMove,
  changeStyleOfHoverItem,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: itemType,
    hover() {
      changeStyleOfHoverItem(workId)
    },
    drop(item: DragItemType) {
      onMove(item.index, index)
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: () => {
      return { workId, index }
    },
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
