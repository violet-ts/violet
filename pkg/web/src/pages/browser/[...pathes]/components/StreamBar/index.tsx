import type {
  ApiMessage,
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
import { Spacer } from 'src/components/atoms/Spacer'
import styled from 'styled-components'
import { MessageCell } from './MessageCell'
import { MessageIcon } from './MessageIcon'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: calc(100vh - 48px);
  border-left: 1px solid ${colors.violet}${alphaLevel[2]};
`
const StreamBox = styled.div`
  bottom: 0;
  flex: 1;
  min-height: 80px;
  overflow-y: scroll;
`
const MessageBox = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding: 8px;
`
const InputForm = styled.textarea`
  flex: 1;
  min-height: 120px;
  resize: none;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`
const ClickableArea = styled.div`
  cursor: pointer;
  background-color: transparent;
  border: none;
`
export const StreamBar = (props: {
  projectId: ProjectId
  workId: WorkId
  revision: BrowserRevision
}) => {
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const { api, onErr } = useApi()
  const [content, setMessage] = useState('')
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const userName = 'Charles M Schultz'

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

  const submitMessage = useCallback(
    async (id: RevisionId) => {
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
  }, [props.revision.messages?.length])

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
    <Container>
      <StreamBox>
        {props.revision.messages.map(
          (m, i) =>
            props.revision &&
            props.revision.messages.length > 0 && (
              <React.Fragment key={i}>
                <MessageCell message={m} replyMessage={replyMessage} />
              </React.Fragment>
            )
        )}
        <div ref={scrollBottomRef} />
      </StreamBox>
      <MessageBox>
        <InputForm
          placeholder="message"
          value={content}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ClickableArea onClick={() => submitMessage(props.revision.id)}>
          <Spacer axis="y" size={88} />
          <MessageIcon />
        </ClickableArea>
      </MessageBox>
    </Container>
  )
}
