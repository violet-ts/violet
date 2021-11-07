import type { ApiRevision, BrowserProject, WorkId } from '@violet/api/types'
import { acceptExtensions, fileTypes } from '@violet/def/constants'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Modal } from '../../../../../components/atoms/Modal'

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

const AlertMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, -50%);
`

export const EmptyWork = ({ project }: { project: BrowserProject }) => {
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const [dragging, setDragging] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const dragEnter = () => setDragging(true)
  const dragLeave = () => setDragging(false)

  const drop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) {
      e.target.value = ''
      setDragging(false)
      return
    }
    const targetFileType = e.target.files[0].type
    const typeList = fileTypes.map<string>((x) => x.type)
    typeList.some((t) => t === targetFileType) ? sendFormData(e.target.files) : setOpenAlert(true)
    e.target.value = ''
  }
  const updateRevisions = (revisionRes: { workId: WorkId; revisions: ApiRevision[] }) => {
    updateApiWholeData(
      'revisionsList',
      apiWholeData.revisionsList.some((r) => r.workId === revisionRes.workId)
        ? apiWholeData.revisionsList.map((r) => (r.workId === revisionRes.workId ? revisionRes : r))
        : [...apiWholeData.revisionsList, revisionRes]
    )
  }
  const sendFormData = async (file: FileList) => {
    setDragging(false)
    if (!project.openedTabId) return
    if (!file) return
    const newRevision = await api.browser.works
      ._workId(project.openedTabId)
      .revisions.$post({ body: { uploadFile: file[0], projectId: project.id } })
      .catch(onErr)

    if (!newRevision) return
    const revisionRes = await api.browser.works._workId(project.openedTabId).revisions.$get()

    if (!revisionRes) return
    updateRevisions(revisionRes)
  }

  const closeModal = () => {
    setDragging(false)
    setOpenAlert(false)
  }

  return (
    <Container>
      {openAlert ? (
        <Modal closeModal={closeModal}>
          <AlertMessage>UnSupported File Format!</AlertMessage>
        </Modal>
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
