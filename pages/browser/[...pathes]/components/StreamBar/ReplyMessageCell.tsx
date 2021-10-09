import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiReply } from '~/server/types'
import { MessageHeader } from './MessageHeader'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Message = styled.div`
  position: relative;
  padding: 0 16px;
  font-size: 12px;
  overflow-wrap: break-word;
`
export const ReplyMessageCell = (props: { replymessagecell: ApiReply[] }) => {
  return (
    <Container>
      {props.replymessagecell.map((r, i) => (
        <React.Fragment key={i}>
          <MessageHeader userName={r.userName} createdAt={r.createdAt} />
          <Spacer axis="y" size={8} />
          <Message>{r.content}</Message>
          <Spacer axis="y" size={8} />
        </React.Fragment>
      ))}
    </Container>
  )
}
