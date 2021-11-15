import type { MessageId, ProjectId, WorkId } from '@violet/lib/types/branded'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { PencilIcon } from 'src/components/atoms/PencilIcon'
import { Spacer } from 'src/components/atoms/Spacer'
import type { BrowserRevision } from 'src/types/browser'
import styled from 'styled-components'
import { MessageCell } from './MessageCell'

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
  overflow-y: auto;
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
`
export const StreamBar = (props: {
  projectId: ProjectId
  workId: WorkId
  revision: BrowserRevision
}) => {
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const { api, onErr } = useApi()
  const [content, setContent] = useState('')
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const userName = 'Charles M Schultz'

  const submitMessage = useCallback(async () => {
    if (!content) return
    await api.browser.works
      ._workId(props.workId)
      .revisions._revisionId(props.revision.id)
      .post({ body: { content, userName } })
      .catch(onErr)

    const messageRes = await api.browser.works
      ._workId(props.workId)
      .revisions._revisionId(props.revision.id)
      .messages.$get()

    updateApiWholeData(
      'messagesList',
      apiWholeData.messagesList.map((m) =>
        m.revisionId === messageRes.revisionId ? messageRes : m
      )
    )

    setContent('')
  }, [content])

  useEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  }, [props.revision.messages.length])

  const replyMessage = useCallback(
    async (messageId: MessageId, content: string) => {
      if (!content) return
      await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(props.revision.id)
        .messages._messageId(messageId)
        .replies.post({ body: { content, userName } })

      const replyRes = await api.browser.works
        ._workId(props.workId)
        .revisions._revisionId(props.revision.id)
        .messages.$get()
        .catch(onErr)

      if (!replyRes) return

      updateApiWholeData(
        'messagesList',
        apiWholeData.messagesList.map((m) => (m.revisionId === replyRes.revisionId ? replyRes : m))
      )
    },
    [content]
  )

  return (
    <Container>
      <StreamBox>
        {props.revision.messages.map((m, i) => (
          <MessageCell key={i} message={m} replyMessage={replyMessage} />
        ))}
        <div ref={scrollBottomRef} />
      </StreamBox>
      <MessageBox>
        <InputForm
          placeholder="message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ClickableArea onClick={submitMessage}>
          <Spacer axis="y" size={88} />
          <PencilIcon />
        </ClickableArea>
      </MessageBox>
    </Container>
  )
}
