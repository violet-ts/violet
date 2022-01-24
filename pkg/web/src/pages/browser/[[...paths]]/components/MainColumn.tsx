import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { AddButton } from '@violet/web/src/components/atoms/AddButton'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import type { PageDirection } from '@violet/web/src/types/tools'
import { alphaLevel, colors, mainColumnHeight } from '@violet/web/src/utils/constants'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { PaginationBar } from './PaginationBar'
import { AlertModal } from './Parts/AlertModal'
import { FileDropper } from './Parts/FileDropper'
import { Revision } from './Revision'
import { StreamBar } from './StreamBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${mainColumnHeight};
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background-color: ${colors.white};
  }
`
const MainContent = styled.div`
  display: flex;
  width: 100%;
  scroll-snap-align: start;
`
const RevisionContent = styled.div<{ dragging: boolean }>`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  border: ${(props) => (props.dragging ? `4px ${colors.blue}${alphaLevel[3]} solid` : 'none')};
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
  const [dragging, setDragging] = useState(false)
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

  const dropFile = (files: FileList) => {
    if (!files) return

    if (files.length === 1 && fileTypes.some((file) => file.type === files[0].type)) {
      void sendFormData(files[0])
    }
    setOpen(!fileTypes.some((f) => f.type === files[0].type))
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files)
    }
    e.target.value = ''
  }
  const clickPagination = (pageDirection: PageDirection, index: number) => {
    const targetRef =
      pageDirection === 'previousPage' ? refs.current[index - 1] : refs.current[index + 1]
    targetRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Container>
      {props.revisions.map((revision, i) => (
        <MainContent key={revision.id} ref={refs.current[i]}>
          <RevisionContent dragging={dragging}>
            <FileDropper onDrop={dropFile} setDragging={setDragging}>
              <Revision projectId={props.projectId} workId={props.workId} revision={revision} />
            </FileDropper>
          </RevisionContent>
          <StreamBarColumn>
            <StreamBar projectId={props.projectId} workId={props.workId} revision={revision} />
          </StreamBarColumn>
          <ToolBar>
            <PaginationBar clickPagination={(result) => clickPagination(result, i)} />
            <AddButton>
              <FileUpload type="file" accept={acceptExtensions} onChange={onChange} />
            </AddButton>
          </ToolBar>
        </MainContent>
      ))}
      <AlertModal open={open} onClose={() => setOpen(false)} />
    </Container>
  )
}
