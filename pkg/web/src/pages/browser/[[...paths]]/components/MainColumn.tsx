import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { AddButton } from '@violet/web/src/components/atoms/AddButton'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import type { PageDirection } from '@violet/web/src/types/tools'
import { mainColumnHeight } from '@violet/web/src/utils/constants'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { PaginationBar } from './PaginationBar'
import { AlertModal } from './Parts/AlertModal'
import { Revision } from './Revision'
import { StreamBar } from './StreamBar'

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
const ToolBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: ${mainColumnHeight};
`
export const MainColumn = (props: {
  projectId: ProjectId
  workId: WorkId
  revisions: BrowserRevision[]
}) => {
  const { api, onErr } = useApiContext()
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const [open, setOpen] = useState(false)
  const refs = useRef(props.revisions.map(() => React.createRef<HTMLDivElement>()))

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

  const dropFile = (file: File) => {
    const searchFileType = fileTypes.some((f) => file.type === f.type)
    if (searchFileType) {
      void sendFormData(file)
    }
    setOpen(!searchFileType)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files[0])
    }
    e.target.value = ''
  }
  const clickPagenation = (pageDirection: PageDirection, index: number) => {
    const targetRef =
      pageDirection === 'previousPage' ? refs.current[index - 1] : refs.current[index + 1]
    targetRef?.current?.scrollIntoView()
  }

  return (
    <Container>
      {props.revisions.map((revision, i) => (
        <MainContent key={revision.id} ref={refs.current[i]}>
          <ToolBar>
            <PaginationBar clickPagenation={(result) => clickPagenation(result, i)} />
            <AddButton>
              <FileUpload type="file" accept={acceptExtensions} onChange={onChange} />
            </AddButton>
          </ToolBar>
          <RevisionContent>
            <Revision
              projectId={props.projectId}
              workId={props.workId}
              revision={revision}
              dropFile={dropFile}
            />
          </RevisionContent>
          <Spacer axis="y" size={8} />
          <StreamBarColumn>
            <StreamBar projectId={props.projectId} workId={props.workId} revision={revision} />
          </StreamBarColumn>
        </MainContent>
      ))}
      <AlertModal open={open} onClose={() => setOpen(false)} />
    </Container>
  )
}
