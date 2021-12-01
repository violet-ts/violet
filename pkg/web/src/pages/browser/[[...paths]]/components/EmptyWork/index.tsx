import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const Column = styled.div`
  display: flex;
  justify-content: end;
`

const SecondaryButton = styled.button`
  padding: 0.3em;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
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
const AlertMessage = styled.div`
  white-space: nowrap;
`

export const EmptyWork = (props: { projectId: ProjectId; workId: WorkId }) => {
  const { api, onErr } = useApiContext()
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const [dragging, setDragging] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const dragEnter = () => setDragging(true)
  const dragLeave = () => setDragging(false)

  const drop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      const targetFileType = e.target.files[0].type
      fileTypes.some((f) => f.type === targetFileType)
        ? void sendFormData(e.target.files)
        : setOpenAlert(true)
    }
    e.target.value = ''
  }
  const sendFormData = async (file: FileList) => {
    setDragging(false)
    if (!file) return

    const revisionRes = await api.browser.projects
      ._projectId(props.projectId)
      .works._workId(props.workId)
      .revisions.$post({ body: { uploadFile: file[0] } })
      .catch(onErr)

    if (!revisionRes) return

    updateWholeDict('revisionsForWorkId', {
      [props.workId]: [
        ...(wholeDict.revisionsForWorkId[props.workId] ?? []),
        { ...revisionRes, workId: props.workId },
      ],
    })
  }

  const closeModal = () => {
    setDragging(false)
    setOpenAlert(false)
  }

  return (
    <Container>
      {openAlert ? (
        <CardModal open={openAlert} onClose={closeModal}>
          <AlertMessage>Unsupported File Format!</AlertMessage>
          <Column>
            <SecondaryButton onClick={closeModal}>Confirm</SecondaryButton>
          </Column>
        </CardModal>
      ) : (
        <>
          <DraggingPanel dragging={dragging}>
            <DraggingFrame dragging={dragging}>Drop file to create new revision</DraggingFrame>
          </DraggingPanel>
          <Dropper
            type="file"
            accept={acceptExtensions}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onChange={drop}
          />
        </>
      )}
    </Container>
  )
}
