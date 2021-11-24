import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { DeskId, ProjectId, RevisionPath, WorkId } from '@violet/lib/types/branded'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import type { InfoJson } from '@violet/web/src/types/files'
import { colors, fontSizes, mainColumnHeight } from '@violet/web/src/utils/constants'
import { useContext, useEffect, useState } from 'react'
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
  display: flex;
  flex-direction: column;
  height: ${mainColumnHeight};
  min-height: 100%;
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksViewer = styled.img`
  height: 100%;
  vertical-align: middle;
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
  const { apiWholeDict, updateApiWholeDict } = useContext(BrowserContext)
  const [workPath, setWorkPath] = useState<RevisionPath[]>([props.revision.url])

  const revisionpath = props.revision.url.substring(0, props.revision.url.lastIndexOf('/'))

  useEffect(() => {
    async function fetchInfoJson() {
      setWorkPath(
        await fetch(props.revision.url).then(async (res) => {
          const json = JSON.stringify(await res?.json())
          const infoJson = JSON.parse(json) as InfoJson
          return infoJson?.fallbackImageExts?.map(
            (j, i) => `${revisionpath}/${i}.${j}` as RevisionPath
          )
        })
      )
    }
    void fetchInfoJson()
  }, [props.revision.url, revisionpath])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      void dropFile(e.target.files[0])
    }
    setIsFile(false)
    e.target.value = ''
  }

  const dropFile = async (file: File) => {
    fileTypes.some((f) => file.type === f.type) ? await sendFormData(file) : setOpenAlert(true)
  }

  const sendFormData = async (file: File) => {
    const revisionRes = await api.browser.projects
      ._projectId(props.projectId)
      .works._workId(props.workId)
      .revisions.$post({ body: { uploadFile: file, deskId: props.deskId } })
      .catch(onErr)

    if (!revisionRes) return
    updateApiWholeDict('revisionsDict', {
      [props.workId]: [...apiWholeDict.revisionsDict[props.workId], revisionRes],
    })
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
        {workPath && workPath.map((p, i) => <DisplayWorksViewer key={i} src={p} />)}
      </DisplayWorksFrame>
    </Container>
  )
}
