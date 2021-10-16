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
  transform: translateY(-50%) translateX(-50%);
`

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  width: 48px;
  height: 48px;
  font-size: ${fontSizes.large};
  color: ${colors.gray};
  background-color: ${colors.transparent};
  border: none;
`
export const FileTypeAlertModal = (props: { closeModal: () => void }) => {
  const closeModal = () => {
    props.closeModal()
  }
  return (
    <Container onClick={closeModal}>
      <Modal open>
        <AlertMessage>UnSupported File Format!</AlertMessage>
        <CloseButton> × </CloseButton>
      </Modal>
    </Container>
  )
}
