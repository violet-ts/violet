import type { DeskId, ProjectId, WorkId } from '@violet/lib/types/branded'
import { maincolumnHeight } from '@violet/web/src/utils/constants'
import React from 'react'
import { Spacer } from 'src/components/atoms/Spacer'
import type { BrowserRevision } from 'src/types/browser'
import styled from 'styled-components'
import { Revision } from '../components/Revision'
import { StreamBar } from '../components/StreamBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: ${maincolumnHeight};
  width: 100%;
`
const MainContent = styled.div`
  display: flex;
`
const RevisionContent = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 100%;
`
const StreamBarColumn = styled.div`
  height: ${maincolumnHeight};
`
export const MainColumn = (props: {
  projectId: ProjectId
  deskId: DeskId
  workId: WorkId
  revisions: BrowserRevision[]
}) => {
  return (
    <Container>
      {props.revisions.map((revision, i) => (
        <MainContent key={i}>
          <RevisionContent>
            <Revision
              projectId={props.projectId}
              deskId={props.deskId}
              workId={props.workId}
              revision={revision}
            />
          </RevisionContent>
          <Spacer axis="y" size={8} />
          <StreamBarColumn>
            <StreamBar projectId={props.projectId} workId={props.workId} revision={revision} />
          </StreamBarColumn>
        </MainContent>
      ))}
    </Container>
  )
}
