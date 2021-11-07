import type {
  ApiMessage,
  ApiRevision,
  BrowserMessage,
  BrowserReply,
  BrowserRevision,
  MessageId,
  ProjectId,
  WorkId,
} from '@violet/api/types'
import React, { useMemo } from 'react'
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
  revisions: ApiRevision[]
  messages: ApiMessage[] | undefined
}) => {
  const getMessgaesByMessageIds = (messageId: MessageId) => {
    const message = props.messages?.filter((m) => m.id === messageId)
    if (!(message?.length === 1)) return
    const messageRes: BrowserMessage = {
      id: message[0].id,
      content: message[0].content,
      createdAt: message[0].createdAt,
      userName: message[0].userName,
      replys: message[0].replys.map<BrowserReply>(({ id, content, createdAt, userName }) => ({
        id,
        content,
        createdAt,
        userName,
      })),
    }
    return messageRes
  }
  const messagesByRevisionId = useMemo(() => {
    return props.revisions.map<BrowserRevision>(({ id, messageIds }) => ({
      id,
      editions: [],
      messages: messageIds.map((id) => id && getMessgaesByMessageIds(id)),
    }))
  }, [props.revisions, props.messages])

  return (
    <Container>
      {messagesByRevisionId.map((revision, i) => (
        <>
          <MainContent key={i}>
            <RevisionContent>
              <Revision projectId={props.projectId} workId={props.workId} revision={revision} />
            </RevisionContent>
            <Spacer axis="y" size={8} />
            <StreamBarColumn>
              <StreamBar
                projectId={props.projectId}
                workId={props.workId}
                revision={revision}
                messages={revision.messages}
              />
            </StreamBarColumn>
          </MainContent>
        </>
      ))}
    </Container>
  )
}
