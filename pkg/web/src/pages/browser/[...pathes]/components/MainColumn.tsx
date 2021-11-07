import type { BrowserRevision, ProjectId, WorkId } from '@violet/api/types'
import React from 'react'
import { Spacer } from 'src/components/atoms/Spacer'
import styled from 'styled-components'
import { Revision } from '../components/Revision'
import { StreamBar } from '../components/StreamBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const MainContent = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100vh - 48px);
  overflow-y: scroll;
`
const RevisionContent = styled.div`
  flex: 1;
`
const StreamBarColumn = styled.div`
  height: 100vh;
`
export const MainColumn = (props: {
  projectId: ProjectId
  workId: WorkId
  revisions: BrowserRevision[]
}) => {
  return (
    <Container>
      {props.revisions.map((revision, i) => (
        <MainContent key={i}>
          <RevisionContent>
            <Revision projectId={props.projectId} workId={props.workId} revision={revision} />
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
