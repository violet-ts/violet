import React, { useState } from 'react'
import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'
import { ArrowTopLeftO } from './MessageIcon'

const Container = styled.div`
  display: flex;
  flex-direction: row;
`
const InputForm = styled.textarea`
  width: 100%;
  min-height: 64px;
  margin: 4px;
  resize: none;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`

export const ReplyMessageBox = () => {
  const [content, setMessage] = useState('')
  const [isClick, setIsClick] = useState(false)
  const replyButtonClick = () => {
    setIsClick(true)
    setMessage('')
  }
  return (
    <Container>
      <InputForm placeholder="reply" value={content} onChange={(e) => setMessage(e.target.value)} />
      <ArrowTopLeftO click={replyButtonClick} />
    </Container>
  )
}
