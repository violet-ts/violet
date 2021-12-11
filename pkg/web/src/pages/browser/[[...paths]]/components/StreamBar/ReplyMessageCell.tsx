import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import type { BrowserReply } from '@violet/web/src/types/browser'
import React from 'react'
import styled from 'styled-components'
import { MessageHeader } from './MessageHeader'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Message = styled.div`
  padding: 0 16px;
  font-size: 12px;
  overflow-wrap: break-word;
`
export const ReplyMessageCell = (props: { replies: BrowserReply[] }) => {
  return (
    <Container>
      {props.replies.map((r) => (
        <React.Fragment key={r.id}>
          <MessageHeader userName={r.userName} createdAt={r.createdAt} />
          <Spacer axis="y" size={8} />
          <Message>{r.content}</Message>
        </React.Fragment>
      ))}
    </Container>
  )
}
