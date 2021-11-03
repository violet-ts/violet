import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiMessage, ApiRevision, MessageId } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'
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
  revision: ApiRevision
  message: ApiMessage
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
      {props.message.replys.length > 0 && (
        <div>
          <ReplyMessageCell replies={props.message.replys} />
          <Spacer axis="y" size={8} />
        </div>
      )}
      <ReplyInputForm sendContent={sendContent} />
    </Container>
  )
}
