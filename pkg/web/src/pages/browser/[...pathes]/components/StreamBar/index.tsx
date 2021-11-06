import type {
  ApiMessage,
  ApiRevision,
  BrowserMessage,
  BrowserReply,
  BrowserRevision,
  MessageId,
  ProjectId,
  RevisionId,
  WorkId,
} from '@violet/api/types'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MessageCell } from './MessageCell'
import { MessageIcon } from './MessageIcon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: calc(100vh - 40px);
  border-left: 1px solid ${colors.violet}${alphaLevel[2]};
`
const StreamBox = styled.div`
  bottom: 0;
  flex: 1;
  min-height: 80px;
  overflow-y: scroll;
`
const MessageBox = styled.div`
  flex-shrink: 0;
  justify-content: flex-end;
  padding: 8px;
`
const InputForm = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: none;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`
const ClickableArea = styled.button`
  position: fixed;
  right: 8px;
  bottom: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  background-color: transparent;
  border: none;
`
const SubmitIcon = styled.div`
  position: fixed;
  right: 16px;
  bottom: 24px;
  width: 16px;
  height: 4px;
  border-right: solid transparent;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  box-shadow: 0 0 0 2px, inset -2px 0 0;
  transform: rotate(-45deg);
  ::before {
    position: fixed;
    top: -2px;
    left: -12px;
    box-sizing: border-box;
    display: block;
    width: 8px;
    height: 8px;
    content: '';
    border-top: 4px solid transparent;
    border-right: 8px solid;
    border-bottom: 4px solid transparent;
  }
`
export const StreamBar = (props: {
  projectId: ProjectId
  workId: WorkId
  revision: ApiRevision
  messages: ApiMessage[] | undefined
}) => {
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const { api, onErr } = useApi()
  const [content, setMessage] = useState('')
  const [messagesByRevisionId, setMessagesByRevisionId] = useState<BrowserRevision[]>()
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const getMessgaesByMessageIds = (messageId: MessageId) => {
    console.log('REVISIONS->', props.revision, 'MESSAGES->', props.messages)
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
  const userName = 'Charles M Schultz'
  const submitMessage = useCallback(
    async (id: RevisionId) => {
      console.log('SEND!!->', content, 'ID->', id)
      if (!content) return
      await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(id)
        .post({ body: { content, userName } })
        .catch(onErr)
      const messageRes = await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(id)
        .$get()

      if (!messageRes) return
      updateMessage(messageRes)
      setMessage('')
    },
    [content]
  )
  useEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  }, [props.messages?.length])
  const updateMessage = (messageRes: { revisionId: RevisionId; messages: ApiMessage[] }) => {
    updateApiWholeData(
      'messagesList',
      apiWholeData.messagesList.some((r) => r.revisionId === messageRes.revisionId)
        ? apiWholeData.messagesList.map((r) =>
            r.revisionId === messageRes.revisionId ? messageRes : r
          )
        : [...apiWholeData.messagesList, messageRes]
    )
  }
  const replyMessage = useCallback(
    async (messageId: MessageId, content: string) => {
      if (!content) return
      await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(props.revision.id)
        .messages._messageId(messageId)
        .replies.$post({ body: { content, userName } })

      const replyRes = await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(props.revision.id)
        .messages.$get()
        .catch(onErr)

      if (!replyRes) return
      updateMessage(replyRes)
    },
    [content]
  )
  return (
    <div>
      <>
        <Container>
          <StreamBox>
            {props.messages?.map(
              (message, i) =>
                message && <MessageCell key={i} message={message} replyMessage={replyMessage} />
            )}
            <div ref={scrollBottomRef} />
          </StreamBox>
          <MessageBox>
            <InputForm
              placeholder="message"
              value={content}
              onChange={(e) => setMessage(e.target.value)}
            />
            <ClickableArea>
              <MessageIcon onClick={() => submitMessage(props.revision.id)} />
            </ClickableArea>
          </MessageBox>
        </Container>
      </>
    </div>
  )
}
