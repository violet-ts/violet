import React, { useState } from 'react'
import styled from 'styled-components'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'
import { FileTypeAlertModal } from './FileTypeAlertModal'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const DraggingPanel = styled.div<{ dragging: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: ${(props) => (props.dragging ? 32 : 160)}px;
  background: ${(props) => (props.dragging ? colors.gray : colors.transparent)};
  transition: background 0.2s, padding 0.2s;
`

const DraggingFrame = styled.div<{ dragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${fontSizes.big};
  color: ${(props) => (props.dragging ? colors.white : colors.gray)};
  border: 4px dashed ${(props) => (props.dragging ? colors.white : colors.gray)};
  border-radius: 24px;
`

const Dropper = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
`

const Modal = styled.dialog`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 480px;
  height: 120px;
  font-size: ${fontSizes.midium};
  color: ${colors.white};
  background-color: ${colors.red}${alphaLevel[7]};
  border: none;
  border-radius: 8px;
  transform: translate(-50%, -50%);
`
const CloseButton = styled.button`
  position: absolute;
  right: 0;
  width: 48px;
  height: 48px;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  background-color: ${colors.transparent};
  border: none;
`

const AlertMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`

const ModalCloseAble = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.violet}${alphaLevel[3]};
  opacity: 0;
`
export const EmptyWork = () => {
  const [dragging, setDragging] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const dragEnter = () => setDragging(true)
  const dragLeave = () => setDragging(false)
  const drag = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) {
      return setDragging(false)
    }
    console.log('filetype->', e.target.files[0].type)
    e.target.files[0].type !== 'aplication/pdf'
      ? setOpenAlert(true)
      : console.log('Send file to server, view PDF')
    e.target.value = ''
  }
  const drop = (e: React.DragEvent<HTMLInputElement>) => {
    if (e.dataTransfer.types.length !== 1) {
      return setDragging(false)
    }
    e.dataTransfer.files[0].type !== 'aplication/pdf'
      ? setOpenAlert(true)
      : console.log('Send file to server, view PDF')
  }
  const closeModal = () => {
    setDragging(false)
    setOpenAlert(false)
  }

  return (
    <Container>
      {openAlert ? (
        <FileTypeAlertModal closeModal={closeModal} />
      ) : (
        <div>
          <DraggingPanel dragging={dragging}>
            <DraggingFrame dragging={dragging}>Drop file to create new revision</DraggingFrame>
          </DraggingPanel>
          <Dropper type="file" onDragEnter={dragEnter} onDragEnd={dragLeave} onDrop={drop} />
        </div>
      )}
    </Container>
  )
}
