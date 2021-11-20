import { Portal } from '@violet/web/src/components/atoms/Portal'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.black}${alphaLevel[8]};
`

const Main = styled.div`
  position: absolute;
`

const Card = styled.div`
  padding: 2em;
  background-color: white;
  border-radius: 6px;
`

interface Props {
  open?: boolean
  children?: React.ReactNode
  onClose?: () => void
}

export const CardModal: React.FC<Props> = ({ open, children, onClose }: Props) => {
  return (
    <Portal>
      {open && (
        <Container>
          <Background onClick={onClose} />
          <Main>
            <Card>{children}</Card>
          </Main>
        </Container>
      )}
    </Portal>
  )
}
