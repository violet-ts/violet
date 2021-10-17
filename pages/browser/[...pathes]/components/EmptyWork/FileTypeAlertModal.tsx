import styled from 'styled-components'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.black}${alphaLevel[3]};
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
  background-color: ${colors.violet}${alphaLevel[3]};
  border: none;
  border-radius: 16px;
`
export const FileTypeAlertModal = (props: { closeModal: () => void }) => {
  return (
    <Container onClick={props.closeModal}>
      <Modal open>
        <AlertMessage>UnSupported File Format!</AlertMessage>
        <CloseButton> OK </CloseButton>
      </Modal>
    </Container>
  )
}
