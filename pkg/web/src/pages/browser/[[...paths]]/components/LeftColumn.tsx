import { Portal } from '@violet/web/src/components/atoms/Portal'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div.attrs<{ width: number }>((props) => ({
  style: { width: `${props.width}px` },
}))<{
  width: number
}>`
  position: relative;
  height: 100vh;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
`

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: w-resize;
  transition: background 0.2s;

  &:hover {
    background: ${colors.blue};
  }
`

const MovableArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const MIN_WIDTH = 100
const clampX = (width: number) =>
  Math.min(window.innerWidth - MIN_WIDTH, Math.max(MIN_WIDTH, width))

type ComponentProps = PropsWithChildren<{
  leftColumnWidth: number
  setLeftColumnWidth: Dispatch<SetStateAction<number>>
}>

export const LeftColumn = ({ children, leftColumnWidth, setLeftColumnWidth }: ComponentProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [diffX, setDiffX] = useState(0)
  const start = (e: React.MouseEvent) => {
    setDiffX(leftColumnWidth - e.pageX)
    setIsResizing(true)
  }
  const move = (e: React.MouseEvent) => {
    if (!isResizing) return

    setLeftColumnWidth(clampX(e.pageX + diffX))
  }

  useEffect(() => {
    let timeoutId = 0
    const resize = () => {
      timeoutId = window.setTimeout(() => setLeftColumnWidth(clampX), 100)
    }

    window.addEventListener('resize', resize, false)

    return () => {
      window.removeEventListener('resize', resize, false)
      clearTimeout(timeoutId)
    }
  }, [setLeftColumnWidth])

  return (
    <Container width={leftColumnWidth}>
      {children}
      <ResizeHandle onMouseDown={start} onMouseMove={move} onMouseUp={() => setIsResizing(false)}>
        {isResizing && (
          <Portal>
            <MovableArea />
          </Portal>
        )}
      </ResizeHandle>
    </Container>
  )
}
