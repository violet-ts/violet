import styled from 'styled-components'
import { Portal } from '~/components/atoms/Portal'

const MovableArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
export const LeftColumnResizeAbleArea = () => {
  return (
    <Portal>
      <MovableArea />
    </Portal>
  )
}
