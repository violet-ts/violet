import { PencilIcon } from '@violet/web/src/components/atoms/PencilIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import React, { useState } from 'react'
import styled from 'styled-components'

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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 24px;
  cursor: pointer;
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
      <Spacer axis="x" size={4} />
      <ClickableArea onClick={replyButtonClick}>
        <PencilIcon />
        <Spacer axis="y" size={16} />
      </ClickableArea>
    </Container>
  )
}
