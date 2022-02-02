import { colors } from '@violet/web/src/utils/constants'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import type { DropTargetMonitor } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${colors.gray};
`

type ComponentProps = PropsWithChildren<{
  onDrop: (item: FileList) => void
  setDragging: (value: React.SetStateAction<boolean>) => void
}>

export const FileDropper = ({ children, onDrop, setDragging }: ComponentProps) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    {
      accept: [NativeTypes.FILE],
      drop(item: DataTransfer) {
        if (onDrop && item !== null) {
          onDrop(item.files)
        }
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    },
    []
  )

  useEffect(() => setDragging(canDrop && isOver), [canDrop, isOver, setDragging])

  return <Container ref={drop}>{children}</Container>
}
