import { fileTypes } from '@violet/def/constants'
import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import type { PropsWithChildren } from 'react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { AlertModal } from '../Parts/AlertModal'
import { FileDropper } from '../Parts/FileDropper'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const DraggingPanel = styled.div<{ dragging: boolean }>`
  width: 100%;
  height: 100%;
  padding: ${(props) => (props.dragging ? 32 : 160)}px;
  background: ${(props) => (props.dragging ? colors.black : colors.transparent)}${alphaLevel[1]};
`

const DraggingFrame = styled.div`
  width: 100%;
  height: 100%;
  border: dashed 4px ${colors.violet}${alphaLevel[3]};
`

type ComponentProps = PropsWithChildren<{ projectId: ProjectId; workId: WorkId }>

export const EmptyWork = ({ children, projectId, workId }: ComponentProps) => {
  const { api, onErr } = useApiContext()
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const [dragging, setDragging] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)

  const dropFile = (files: FileList) => {
    if (files.length === 1) {
      const targetFileType = files[0].type
      fileTypes.some((f) => f.type === targetFileType)
        ? void sendFormData(files)
        : setOpenAlert(true)
    }
  }

  const sendFormData = async (file: FileList) => {
    if (!file) return

    const revisionRes = await api.browser.projects.pId
      ._projectId(projectId)
      .works._workId(workId)
      .revisions.$post({ body: { uploadFile: file[0] } })
      .catch(onErr)

    if (!revisionRes) return

    updateWholeDict('revisionsForWorkId', {
      [workId]: [...(wholeDict.revisionsForWorkId[workId] ?? []), { ...revisionRes, workId }],
    })
  }

  const closeModal = () => {
    setDragging(false)
    setOpenAlert(false)
  }

  return (
    <Container>
      {children}
      {openAlert ? (
        <AlertModal open={openAlert} onClose={closeModal} />
      ) : (
        <DraggingPanel dragging={dragging}>
          <DraggingFrame>
            <FileDropper onDrop={dropFile} setDragging={setDragging}>
              {dragging ? 'Release to drop' : 'Drag file here'}
            </FileDropper>
          </DraggingFrame>
        </DraggingPanel>
      )}
    </Container>
  )
}
