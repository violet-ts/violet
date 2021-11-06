import { Portal } from '@violet/web/src/components/atoms/Portal'
import { alphaLevel, colors, fontSizes } from '@violet/web/src/utils/constants'
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
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
  white-space: nowrap;
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

const InputFormProject = styled.div`
  position: absolute;
  top: 80px;
  left: 35%;
`

export const FileTypeAlertModal = (props: {
  closeModal: () => void
  message: string
  type: 'text' | 'input'
}) => {
  const inputElement = useRef<HTMLInputElement>(null)
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const [label, setLabel] = useState('')
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus()
    }
  }, [inputElement.current])
  const sendProjectName = (e: FormEvent) => {
    e.preventDefault()
    props.closeModal()
  }
  return (
    <Portal>
      <Container>
        <Modal open>
          <AlertMessage>{props.message}</AlertMessage>
          {props.type === 'input' ? (
            <InputFormProject>
              <form onSubmit={sendProjectName}>
                <input
                  ref={inputElement}
                  onBlur={sendProjectName}
                  type="text"
                  onChange={inputLabel}
                />
              </form>
            </InputFormProject>
          ) : (
            <></>
          )}
          <CloseButton onClick={props.closeModal}> OK </CloseButton>
        </Modal>
      </Container>
    </Portal>
  )
}
