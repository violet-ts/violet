import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { ProjectId, RevisionId, WorkId } from '@violet/lib/types/branded'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import { mainColumnHeight } from '@violet/web/src/utils/constants'
import React, { useState } from 'react'
import styled from 'styled-components'
import { AddButton } from '../../../../components/atoms/AddButton'
import { Revision } from '../components/Revision'
import { StreamBar } from '../components/StreamBar'
import { PaginationBar } from './PaginationBar'
import { AlertModal } from './Revision/AlertModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${mainColumnHeight};
`
const MainContent = styled.div`
  display: flex;
`
const RevisionContent = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
`
const StreamBarColumn = styled.div`
  height: ${mainColumnHeight};
`
const FileUpload = styled.input`
  display: none;
`
const ButtonWrap = styled.div`
  position: fixed;
  bottom: 8px;
`
export const MainColumn = (props: {
  projectId: ProjectId
  workId: WorkId
  revisions: BrowserRevision[]
}) => {
  const { api, onErr } = useApiContext()
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const [openModal, setOpenModal] = useState(false)
  const sendFormData = async (file: File) => {
    const revisionRes = await api.browser.projects
      ._projectId(props.projectId)
      .works._workId(props.workId)
      .revisions.$post({ body: { uploadFile: file } })
      .catch(onErr)

    if (!revisionRes) return

    updateWholeDict('revisionsForWorkId', {
      [props.workId]: [
        ...(wholeDict.revisionsForWorkId[props.workId] ?? []),
        { ...revisionRes, workId: props.workId },
      ],
    })
  }
  const openAlertModal = (isOpen: boolean) => {
    setOpenModal(isOpen)
  }
  const dropFile = (file: File) => {
    fileTypes.some((f) => file.type === f.type) ? void sendFormData(file) : setOpenModal(true)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files[0])
    }
    e.target.value = ''
  }
  const clickchevron = (id: RevisionId, chevronup: boolean) => {
    console.log(id, chevronup)
    return chevronup
  }
  return (
    <Container>
      {props.revisions.map((revision, i) => (
        <MainContent key={i}>
          <PaginationBar clickchevron={(result: boolean) => clickchevron(revision.id, result)} />
          <RevisionContent>
            <Revision
              projectId={props.projectId}
              workId={props.workId}
              revision={revision}
              sendFormData={sendFormData}
              openAlertModal={openAlertModal}
            />
          </RevisionContent>
          <Spacer axis="y" size={8} />
          <StreamBarColumn>
            <StreamBar projectId={props.projectId} workId={props.workId} revision={revision} />
          </StreamBarColumn>
        </MainContent>
      ))}
      <ButtonWrap>
        <AddButton>
          <FileUpload type="file" accept={acceptExtensions} onChange={onChange} />
        </AddButton>
      </ButtonWrap>
      <AlertModal isOpen={openModal} />
    </Container>
  )
}
