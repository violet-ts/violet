import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiMessage, MessageId } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'
import { MessageHeader } from './MessageHeader'
import { ReplyMessageBox } from './ReplyMessageBox'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 80%;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
`
const Message = styled.div`
  position: relative;
  padding-right: 10px;
  margin-bottom: 12px;
  margin-left: 36px;
`

export const CommentBlock = (props: {
  message: ApiMessage
  replyMessage: (messageId: MessageId, content: string) => Promise<void>
}) => {
  const sendContent = (content: string) => {
    props.replyMessage(props.message.id, content)
  }

  return (
    <Container>
      <MessageHeader message={props.message} />
      <Message>{props.message.content}</Message>
      <ReplyMessageBox sendContent={sendContent} />
      <Spacer axis="y" size={4} />
    </Container>
  )
}
