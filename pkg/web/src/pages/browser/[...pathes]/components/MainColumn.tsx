import type { DeskId, ProjectId, WorkId } from '@violet/lib/types/branded'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import React from 'react'
import styled from 'styled-components'
import { mainColumnHeight } from '../../../../utils/constants'
import { Revision } from '../components/Revision'
import { StreamBar } from '../components/StreamBar'

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
