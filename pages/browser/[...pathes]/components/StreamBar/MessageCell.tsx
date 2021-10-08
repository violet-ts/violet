import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiMessage, ApiReply, MessageId } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'
import { MessageHeader } from './MessageHeader'
import { ReplyInputForm } from './ReplyInputForm'
import { ReplyMessageCell } from './ReplyMessageCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
`
const Message = styled.div`
  position: relative;
  padding-right: 10px;
  font-size: 12px;
`

export const MessageCell = (props: {
  message: ApiMessage
  replies: {
    messageId: MessageId
    replies: ApiReply[]
  }[]
  replyMessage: (messageId: MessageId, content: string) => Promise<void>
}) => {
  const sendContent = (content: string) => {
    props.replyMessage(props.message.id, content)
  }

  const repliesByMessageId = () => {
    const replies = props.replies.find((r) => r.messageId === props.message.id)
    return replies
  }

  const replymessagecell = [
    {
      userName: 'TEST REPLY',
      content:
        'REPLYREPLYREPLYREPLYREPLYREPLYREPLYREPLY REPLYREPLYREPLYREPLYREPLYREPLYREPLYREPLYREPLY REPLYREPLYREPLYREPLY REPLYREPLYREPLYREPLYREPLYREPLYREPLY',
      createdAt: 1633245708,
    },
  ]

  return (
    <Container>
      <MessageHeader userName={props.message.userName} createdAt={props.message.createdAt} />
      <Message>
        <p>{props.message.content}</p>
      </Message>
      <Spacer axis="x" size={16} />
      <div>
        <Spacer axis="y" size={16} />
        <ReplyMessageCell replymessagecell={replymessagecell} />
      </div>
      <ReplyInputForm sendContent={sendContent} />
      <Spacer axis="y" size={4} />
    </Container>
  )
}
