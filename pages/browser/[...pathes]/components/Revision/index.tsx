import { useContext, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { ApiRevision, BrowserProject, WorkId } from '~/server/types'
import { acceptExtensions, fileTypes } from '~/server/utils/constants'
import { colors, fontSizes } from '~/utils/constants'
import { FileTypeAlertModal } from '../FileTypeAlertModal'
import { AddButton } from './AddButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 41px);
`

const DisplayWorksArea = styled.div`
  top: 0;
  left: 0;
  flex: 1;
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksFrame = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 200px;
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
const DisplayWorksBody = styled.div`
  overflow-y: scroll;
`

export const Revision = ({ project }: { project: BrowserProject }) => {
  const [isFile, setIsFile] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const [openedTabRevisions, setOpenTabRevision] = useState(
    apiWholeData.revisionsList.filter((e) => e.workId === project.openedTabId)
  )
  const dropFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) {
      e.target.value = ''
      setIsFile(false)
      return
    }
    const targetFileType = e.target.files[0].type
    const acxeptFileTypes = fileTypes.map<string>((f) => f.type)
    acxeptFileTypes.some((t) => t === targetFileType)
      ? sendFormData(e.target.files[0])
      : setOpenAlert(true)
    e.target.value = ''
    setIsFile(false)
  }
  const updateRevisions = (revisionRes: { workId: WorkId; revisions: ApiRevision[] }) => {
    updateApiWholeData(
      'revisionsList',
      apiWholeData.revisionsList.some((r) => r.workId === revisionRes.workId)
        ? apiWholeData.revisionsList.map((r) => (r.workId === revisionRes.workId ? revisionRes : r))
        : [...apiWholeData.revisionsList, revisionRes]
    )
  }
  const sendFormData = async (file: File) => {
    if (!project.openedTabId) return
    if (!file) return
    const addRevision = await api.browser.works
      ._workId(project.openedTabId)
      .revisions.$post({ body: { uploadFile: file, projectId: project.id } })
      .catch(onErr)
    if (!addRevision) return
    console.log('Revision->', addRevision)
    const revisionRes = await api.browser.works._workId(project.openedTabId).revisions.$get()
    console.log('Revisions->', revisionRes)

    if (!revisionRes) return
    updateRevisions(revisionRes)
    setOpenTabRevision(apiWholeData.revisionsList.filter((e) => e.workId === project.openedTabId))
    console.log(
      'OpenTabRevisions->',
      apiWholeData.revisionsList.filter((e) => e.workId === project.openedTabId)
    )
  }
  const closeModal = () => {
    setOpenAlert(false)
  }
  return (
    <Container onDragEnter={() => setIsFile(true)} onChange={dropFile}>
      {openAlert && <FileTypeAlertModal closeModal={closeModal} />}
      {isFile && (
        <>
          <Dropper type="file" accept={acceptExtensions} onChange={dropFile} />
        </>
      )}
      <DisplayWorksBody>
        {openedTabRevisions &&
          openedTabRevisions[0].revisions.map((_o, i) => (
            <DisplayWorksArea key={i}>
              <DisplayWorksFrame>WORK{i + 1}</DisplayWorksFrame>
            </DisplayWorksArea>
          ))}
      </DisplayWorksBody>
      <div>
        <AddButton dropFile={dropFile} />
        <Spacer axis="y" size={8} />
      </div>
    </Container>
  )
}
