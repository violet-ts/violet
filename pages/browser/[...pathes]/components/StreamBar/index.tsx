import type { FormEvent } from 'react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type {
  ApiMessage,
  BrowserProject,
  MessageId,
  ProjectApiData,
  RevisionId,
} from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'
import { CommentBlock } from './CommentBlock'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
export const StreamBar = ({
  project,
  projectApiData,
}: {
  project: BrowserProject
  projectApiData: ProjectApiData
}) => {
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const { api, onErr } = useApi()
  const [content, setMessage] = useState('')
  const scrollBottomRef = useRef<HTMLDivElement>(null)

  const userName = 'Test Name'
  const submitMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!content) return
      if (!project.openedTabId) return
      if (!projectApiData.revisions) return
      const revisionId = projectApiData.revisions.slice(-1)[0].id
      await api.browser.works
        ._workId(project.openedTabId)
        .revisions._revisionId(revisionId)
        .post({ body: { content, userName } })
        .catch(onErr)

      const messageRes = await api.browser.works
        ._workId(project.openedTabId)
        .revisions._revisionId(revisionId)
        .$get()

      if (!messageRes) return

      updateMessage(messageRes)
      setMessage('')
    },
    [content, project, projectApiData]
  )
  useEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  }, [projectApiData.messages?.length])

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
      if (!project.openedTabId) return
      if (!projectApiData.revisions) return
      const revisionId = projectApiData.revisions.slice(-1)[0].id
      const replyRes = await api.browser.works
        ._workId(project.openedTabId)
        .revisions._revisionId(revisionId)
        ._messageId(messageId)
        .replies.post({ body: { content, userName } })
        .catch(onErr)

      if (!replyRes) return
    },
    [content, project, projectApiData]
  )

  return (
    <Container>
      <StreamBox>
        {projectApiData.messages &&
          projectApiData.messages.map((d, i) => (
            <CommentBlock key={i} message={d} replyMessage={replyMessage} />
          ))}
        <div ref={scrollBottomRef} />
      </StreamBox>
      <MessageBox>
        <InputForm
          placeholder="message"
          value={content}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ClickableArea onClick={submitMessage}>
          <SubmitIcon />
        </ClickableArea>
      </MessageBox>
    </Container>
  )
}
