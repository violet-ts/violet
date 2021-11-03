import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { ApiRevision, ProjectId, WorkId } from '~/server/types'
import { acceptExtensions, fileTypes } from '~/server/utils/constants'
import { colors, fontSizes } from '~/utils/constants'
import { FileTypeAlertModal } from '../FileTypeAlertModal'
import { AddButton } from './AddButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px - 48px);
`

const DisplayWorksArea = styled.div`
  min-height: 100%;
  padding: 48px;
  overflow-y: scroll;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  font-size: ${fontSizes.big};
  color: ${colors.violet};
  border: 4px solid ${colors.violet};
  border-radius: 24px;
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

const RevisionFooter = styled.div`
  display: flex;
  justify-content: right;
  height: 56px;
  background-color: ${colors.white};
`

export const Revision = (props: {
  projectId: ProjectId
  workId: WorkId | undefined
  revisions: ApiRevision[]
}) => {
  const [isFile, setIsFile] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const [openedTabRevisions, setOpenTabRevision] = useState(props.revisions)
  useEffect(() => {
    setOpenTabRevision(props.revisions)
  }, [props.revisions])

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
    if (!props.workId) return
    await api.browser.works
      ._workId(props.workId)
      .revisions.$post({ body: { uploadFile: file, projectId: props.projectId } })
      .catch(onErr)

    const revisionRes = await api.browser.works._workId(props.workId).revisions.$get()

    if (!revisionRes) return

    updateApiWholeData(
      'revisionsList',
      apiWholeData.revisionsList.map((r) => (r.workId === revisionRes.workId ? revisionRes : r))
    )
  }
  const closeModal = () => {
    setOpenAlert(false)
  }

  return (
    <>
      <Container
        onDragEnter={() => setIsFile(true)}
        onDragLeave={() => setIsFile(false)}
        onChange={onChange}
      >
        {openAlert && <FileTypeAlertModal closeModal={closeModal} />}
        {isFile && <Dropper type="file" accept={acceptExtensions} />}
        {openedTabRevisions.map((_o, i) => (
          <DisplayWorksArea key={i}>
            <DisplayWorksFrame>WORK{i + 1}</DisplayWorksFrame>
          </DisplayWorksArea>
        ))}
      </Container>
      <RevisionFooter>
        <AddButton dropFile={dropFile} />
        <Spacer axis="x" size={8} />
      </RevisionFooter>
    </>
  )
}
