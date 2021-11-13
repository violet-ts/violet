import type { BrowserMessage, MessageId } from '@violet/api/types'
import { Spacer } from '@violet/web/src//components/atoms/Spacer'
import { alphaLevel, colors } from '@violet/web/src//utils/constants'
import React from 'react'
import styled from 'styled-components'
import { MessageHeader } from './MessageHeader'
import { ReplyInputForm } from './ReplyInputForm'
import { ReplyMessageCell } from './ReplyMessageCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
`
const Message = styled.div`
  position: relative;
  padding: 0 16px;
  font-size: 12px;
  overflow-wrap: break-word;
`

export const MessageCell = (props: {
  message: BrowserMessage
  replyMessage: (messageId: MessageId, content: string) => Promise<void>
}) => {
  const sendContent = (content: string) => {
    props.replyMessage(props.message.id, content)
  }

  return (
    <Container>
      <MessageHeader userName={props.message.userName} createdAt={props.message.createdAt} />
      <Spacer axis="y" size={8} />
      <Message>{props.message.content}</Message>
      <Spacer axis="y" size={16} />
      <ReplyMessageCell replies={props.message.replys} />
      <Spacer axis="y" size={8} />
      <ReplyInputForm sendContent={sendContent} />
      <Spacer axis="y" size={8} />
    </Container>
  )
}
