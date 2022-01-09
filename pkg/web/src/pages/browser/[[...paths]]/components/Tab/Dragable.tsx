import type { WorkId } from '@violet/lib/types/branded'
import type { DragItemType } from '@violet/web/src/types/dragTab'
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'

const DragItem = styled.div<{
  isDragging?: boolean
}>`
  opacity: ${(props) => (props.isDragging ? 0.4 : 1)};
`

interface Props {
  children?: React.ReactNode
  workId: WorkId
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  setHoverItem: (value: React.SetStateAction<WorkId | 'EmptyArea' | null>) => void
}

export const itemType = 'work'

export const Draggable: React.FC<Props> = ({
  children,
  workId,
  index,
  onMove,
  setHoverItem,
}: Props) => {
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
