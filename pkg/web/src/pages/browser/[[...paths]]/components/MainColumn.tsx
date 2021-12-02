import { acceptExtensions, fileTypes } from '@violet/def/constants'
import type { ProjectId, RevisionId, WorkId } from '@violet/lib/types/branded'
import { AddButton } from '@violet/web/src/components/atoms/AddButton'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import { mainColumnHeight } from '@violet/web/src/utils/constants'
import { scroller } from '@violet/web/src/utils/Scroller'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
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
  const [scrollId, setScrollId] = useState<string>('0')

  useEffect(() => {
    scroller(scrollId)
  }, [scrollId])
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
  const unsupportedFileType = (state: boolean) => {
    setOpen(state)
  }
  const dropFile = (file: File) => {
    const searchFileType = fileTypes.some((f) => file.type === f.type)
    if (searchFileType) {
      void sendFormData(file)
    }
    unsupportedFileType(!searchFileType)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files[0])
    }
    e.target.value = ''
  }
  const clickChevron = (id: RevisionId, chevronUp: boolean) => {
    const arrRevisionId = props.revisions.map((r) => r.id)
    const index = arrRevisionId.findIndex((d) => d === id)
    const scrollId = chevronUp ? arrRevisionId[index - 1] : arrRevisionId[index + 1]
    setScrollId(scrollId)

    return chevronUp
  }
  return (
    <Container>
      {props.revisions.map((revision) => (
        <MainContent key={revision.id} data-search-id={revision.id}>
          <ToolBar>
            <PaginationBar clickChevron={(result: boolean) => clickChevron(revision.id, result)} />
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
      <AlertModal open={open} onClose={(state: boolean) => unsupportedFileType(state)} />
    </Container>
  )
}
