import React from 'react'
import styled from 'styled-components'
import { Spacer } from '@violet/frontend/src/components/atoms/Spacer'
import type { ApiReply } from '@violet/api/src/types'
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
export const ReplyMessageCell = (props: { replies: ApiReply[] }) => {
  return (
    <Container>
      {props.replies.map((r, i) => (
        <React.Fragment key={i}>
          <MessageHeader userName={r.userName} createdAt={r.createdAt} />
          <Spacer axis="y" size={8} />
          <Message>{r.content}</Message>
        </React.Fragment>
      ))}
    </Container>
  )
}
