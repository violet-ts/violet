import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { MessageHeader } from './MessageHeader'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Message = styled.div`
  position: relative;
  padding-right: 10px;
  font-size: 12px;
`

export const ReplyMessageCell = (props: {
  replymessagecell: {
    userName: string
    content: string
    createdAt: number
  }[]
}) => {
  return (
    <Container>
      {props.replymessagecell.map((r, i) => (
        <React.Fragment key={i}>
          <MessageHeader userName={r.userName} createdAt={r.createdAt} />
          <Message>
            <p>{r.content}</p>
          </Message>
          <Spacer axis="y" size={8} />
        </React.Fragment>
      ))}
    </Container>
  )
}
