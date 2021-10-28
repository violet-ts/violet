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
  height: 100%;
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
  height: 100%;
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

const AddButtonWrap = styled.button`
  background-color: ${colors.transparent};
  border: none;
`

export const Revision = ({ project }: { project: BrowserProject }) => {
  const [isFile, setIsFile] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const openedTabRevisions = apiWholeData.revisionsList.filter(
    (e) => e.workId === project.openedTabId
  )
  const dropFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('CHANGE!!')
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
    console.log('project.openedTabId->', project.openedTabId)
    if (!project.openedTabId) return
    if (!file) return
    const addRevision = await api.browser.works
      ._workId(project.openedTabId)
      .revisions.$post({ body: { uploadFile: file, projectId: project.id } })
      .catch(onErr)
    if (!addRevision) return
    const revisionRes = await api.browser.works._workId(project.openedTabId).revisions.$get()

    if (!revisionRes) return
    updateRevisions(revisionRes)
  }
  const closeModal = () => {
    setOpenAlert(false)
  }
  return (
    <Container onDragEnter={() => setIsFile(true)}>
      {openAlert && <FileTypeAlertModal closeModal={closeModal} />}
      {isFile && (
        <>
          <Dropper type="file" accept={acceptExtensions} onChange={dropFile} />
        </>
      )}
      <>
        {openedTabRevisions && (
          <DisplayWorksArea>
            <DisplayWorksFrame>SHOW WORK</DisplayWorksFrame>
          </DisplayWorksArea>
        )}
        <div>
          <AddButton />
        </div>
        <Spacer axis="y" size={16} />
      </>
    </Container>
  )
}
