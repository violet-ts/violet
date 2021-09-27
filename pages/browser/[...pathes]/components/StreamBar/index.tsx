import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '~/hooks'
import { BrowserProject, ProjectApiData } from '~/server/types'
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
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`
const SubmitIcon = styled.button`
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
    position: absolute;
    top: -4px;
    left: -14px;
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
  const { api, onErr } = useApi()
  const [content, setMessage] = useState('')
  const scrollBottomRef = useRef<HTMLDivElement>(null)

  const userName = 'Test Name'
  const postMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!content) return
      if (!project.openedTabId) return
      if (!projectApiData.revisions) return
      const res = await api.browser.works
        ._workId(project.openedTabId)
        .revisions._revisionId(projectApiData.revisions.slice(-1)[0].id)
        .post({ body: { content, userName } })
        .catch(onErr)

      if (!res) return

      projectApiData.messages?.push(res.body)
      setMessage('')
    },
    [content, project, projectApiData]
  )
  useEffect(() => {
    scrollBottomRef?.current?.scrollIntoView()
  }, [projectApiData.messages?.length])

  return (
    <Container>
      <StreamBox>
        {projectApiData.messages &&
          projectApiData.messages.map((d, i) => <CommentBlock key={i} message={d} />)}
        <div ref={scrollBottomRef} />
      </StreamBox>
      <MessageBox>
        <InputForm
          placeholder="message"
          value={content}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SubmitIcon type="submit" onClick={postMessage} />
      </MessageBox>
    </Container>
  )
}
