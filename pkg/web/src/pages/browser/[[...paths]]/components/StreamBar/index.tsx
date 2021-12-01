import type { MessageId, ProjectId, WorkId } from '@violet/lib/types/branded'
import { PencilIcon } from '@violet/web/src/components/atoms/PencilIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserRevision } from '@violet/web/src/types/browser'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { MessageCell } from './MessageCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
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
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const { api, onErr } = useApiContext()
  const [content, setContent] = useState('')
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const messages = useMemo(
    () => wholeDict.messagesForRevisionId[props.revision.id],
    [wholeDict.messagesForRevisionId, props.revision]
  )
  const userName = 'Charles M Schultz'

  const submitMessage = useCallback(async () => {
    if (!content) return

    const messagesRes = await api.browser.projects
      ._projectId(props.projectId)
      .works._workId(props.workId)
      .revisions._revisionId(props.revision.id)
      .messages.$post({ body: { content, userName } })
      .catch(onErr)

    if (!messagesRes) return

    updateWholeDict('messagesForRevisionId', {
      [props.revision.id]: [
        ...(messages ?? []),
        { ...messagesRes, revisionId: props.revision.id, replies: [] },
      ],
    })
    setContent('')
  }, [
    props.projectId,
    props.workId,
    messages,
    content,
    api.browser.projects,
    onErr,
    props.revision.id,
    updateWholeDict,
  ])

  useEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  }, [messages?.length])

  const replyMessage = useCallback(
    async (messageId: MessageId, content: string) => {
      if (!content) return

      const replyRes = await api.browser.projects
        ._projectId(props.projectId)
        .works._workId(props.workId)
        .revisions._revisionId(props.revision.id)
        .messages._messageId(messageId)
        .replies.$post({ body: { content, userName } })
        .catch(onErr)

      if (!replyRes) return

      updateWholeDict('messagesForRevisionId', {
        [props.revision.id]: (messages ?? []).map((m) =>
          m.id === messageId ? { ...m, replies: [...m.replies, { ...replyRes, messageId }] } : m
        ),
      })
    },
    [
      props.projectId,
      props.workId,
      messages,
      api.browser.projects,
      onErr,
      props.revision.id,
      updateWholeDict,
    ]
  )

  return (
    <Container>
      <StreamBox>
        {messages?.map((m) => (
          <MessageCell key={m.id} message={m} replyMessage={replyMessage} />
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
