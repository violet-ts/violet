import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { DeskId, ProjectId, WorkId } from '@violet/lib/types/branded'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import { colors, fontSizes, mainColumnHeight } from '@violet/web/src/utils/constants'
import { useContext, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const DisplayWorksFrame = styled.div`
  height: ${mainColumnHeight};
  min-height: 100%;
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksViewer = styled.img`
  width: 100%;
  height: 100%;
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
  const { updateApiWholeDict } = useContext(BrowserContext)

  const workUrl = props.revision.url

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
    await api.browser.works
      ._workId(props.workId)
      .revisions.$post({
        body: { uploadFile: file, projectId: props.projectId, deskId: props.deskId },
      })
      .catch(onErr)

    const revisionRes = await api.browser.works._workId(props.workId).revisions.$get()
    updateApiWholeDict('revisionsDict', revisionRes)
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
      <CardModal open={openAlert} onClose={closeModal}>
        <AlertMessage>UnSupported File Format!</AlertMessage>
        <Column>
          <SecondaryButton onClick={closeModal}>Confirm</SecondaryButton>
        </Column>
      </CardModal>
      {isFile && <Dropper type="file" accept={acceptExtensions} />}
      <DisplayWorksFrame>
        <DisplayWorksViewer src={workUrl} />
      </DisplayWorksFrame>
    </Container>
  )
}
