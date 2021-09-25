import { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '~/hooks'
import { BrowserProject, ProjectApiData } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border-left: 1px solid ${colors.violet}${alphaLevel[2]};
`
const StreamBox = styled.div`
  flex: 1;
`
const MessageBox = styled.div`
  padding: 8px;
`
const InputForm = styled.input`
  width: 100%;
  min-height: 80px;
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
  const inputMessage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value),
    []
  )
  const userName = 'Test Name'
  const postMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!content) return
      if (!project.openedTabId) return
      if (!projectApiData.revisions) return

      const res = api.browser.works
        ._workId(project.openedTabId)
        .revisions._revisionId(projectApiData.revisions.slice(-1)[0].id)
        .post({ body: { content, userName } })
        .catch(onErr)

      if (!res) return

      setMessage('')
    },
    [content]
  )

  return (
    <Container>
      <StreamBox />
      <MessageBox>
        <InputForm placeholder="message" type="text" value={content} onChange={inputMessage} />
        <SubmitIcon type="submit" onClick={postMessage} />
      </MessageBox>
    </Container>
  )
}
