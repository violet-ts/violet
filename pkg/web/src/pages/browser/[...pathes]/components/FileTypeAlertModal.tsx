import { Portal } from '@violet/web/src/components/atoms/Portal'
import { alphaLevel, colors, fontSizes } from '@violet/web/src/utils/constants'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: ${colors.black}${alphaLevel[1]};
`
const Modal = styled.dialog`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 480px;
  height: 120px;
  font-size: ${fontSizes.midium};
  background-color: ${colors.white};
  border: none;
  border-radius: 8px;
  transform: translate(-50%, -50%);
`

const AlertMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const CloseButton = styled.button`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 56px;
  height: 32px;
  font-size: ${fontSizes.large};
  color: ${colors.gray};
  cursor: pointer;
  background-color: ${colors.violet}${alphaLevel[5]};
  border: none;
  border-radius: 16px;
`
export const FileTypeAlertModal = (props: { closeModal: () => void; message: string }) => {
  return (
    <Portal>
      <Container onClick={props.closeModal}>
        <Modal open>
          <AlertMessage>{props.message}</AlertMessage>
          <CloseButton> OK </CloseButton>
        </Modal>
      </Container>
    </Portal>
  )
}
