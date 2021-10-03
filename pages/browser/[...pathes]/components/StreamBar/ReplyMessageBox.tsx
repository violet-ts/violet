import React, { useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { alphaLevel, colors } from '~/utils/constants'
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

export const ReplyMessageBox = () => {
  const [content, setMessage] = useState('')
  const replyButtonClick = () => {
    setMessage('')
  }
  return (
    <Container>
      <Spacer axis="x" size={4} />
      <InputForm placeholder="reply" value={content} onChange={(e) => setMessage(e.target.value)} />
      <Spacer axis="x" size={8} />
      <div>
        <Spacer axis="y" size={48} />
        <MessageIcon onClick={replyButtonClick} />
      </div>
    </Container>
  )
}
