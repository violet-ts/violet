import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { DeskId, ProjectId, S3RevisionPath, WorkId } from '@violet/lib/types/branded'
import { Modal } from '@violet/web/src/components/molecules/Modal'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import { colors, maincolumnHeight } from '@violet/web/src/utils/constants'
import { useContext, useState } from 'react'
import type { BrowserRevision } from 'src/types/browser'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`

const DisplayWorksFrame = styled.div`
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
  height: ${maincolumnHeight};
`

const DisplayWorksViewer = styled.img`
  max-width: 100%;
  max-height: 100%;
`

const Dropper = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: ${colors.transparent};
  opacity: 0;
`

const AlertMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, -50%);
`

export const Revision = (props: {
  projectId: ProjectId
  deskId: DeskId
  workId: WorkId
  revision: BrowserRevision
}) => {
  const [isFile, setIsFile] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)

  const [workUrl] = useState<S3RevisionPath>(props.revision.url)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files[0])
    }
    setIsFile(false)
    e.target.value = ''
  }

  const dropFile = (file: File) => {
    fileTypes.some((f) => file.type === f.type) ? sendFormData(file) : setOpenAlert(true)
  }

  const sendFormData = async (file: File) => {
    const res = await api.browser.works
      ._workId(props.workId)
      .revisions.$post({
        body: { uploadFile: file, projectId: props.projectId, deskId: props.deskId },
      })
      .catch(onErr)

    const revisionsRes = await api.browser.works._workId(props.workId).revisions.$get()

    if (!res) return

    updateApiWholeData(
      'revisionsList',
      apiWholeData.revisionsList.map((r) => (r.workId === revisionsRes.workId ? revisionsRes : r))
    )
  }

  const closeModal = () => {
    setOpenAlert(false)
  }

  return (
    <Container
      onDragEnter={() => setIsFile(true)}
      onDragLeave={() => setIsFile(false)}
      onChange={onChange}
    >
      {openAlert && (
        <Modal closeModal={closeModal}>
          <AlertMessage>UnSupported File Format!</AlertMessage>
        </Modal>
      )}
      {isFile && <Dropper type="file" accept={acceptExtensions} />}
      <DisplayWorksFrame>
        <DisplayWorksViewer src={workUrl} />
      </DisplayWorksFrame>
    </Container>
  )
}
