import { Spacer } from '@violet/web/src//components/atoms/Spacer'
import { alphaLevel, colors } from '@violet/web/src//utils/constants'
import React, { useState } from 'react'
import styled from 'styled-components'
import { MessageIcon } from './MessageIcon'

const Container = styled.div`
  display: flex;
`

const InputForm = styled.textarea`
  width: 100%;
  min-height: 64px;
  resize: none;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`
const ClickableArea = styled.div`
  justify-content: flex-end;
  cursor: pointer;
  background-color: transparent;
  border: none;
`
export const ReplyInputForm = (props: { sendContent: (content: string) => void }) => {
  const [content, setContent] = useState('')
  const replyButtonClick = () => {
    props.sendContent(content)
    setContent('')
  }
  return (
    <Container>
      <Spacer axis="x" size={4} />
      <InputForm placeholder="reply" value={content} onChange={(e) => setContent(e.target.value)} />
      <Spacer axis="x" size={8} />
      <ClickableArea onClick={replyButtonClick}>
        <Spacer axis="y" size={32} />
        <MessageIcon />
      </ClickableArea>
    </Container>
  )
}
