import React from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiReply } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'
import { MessageHeader } from './MessageHeader'

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

export const ReplyMessageCell = (props: { replies: ApiReply[] }) => {
  return (
    <Container>
      {props.replies.map((r) => (
        <>
          <MessageHeader userName={r.userName} createdAt={r.createdAt} />
          <Message>{r.content}</Message>
          <Spacer axis="y" size={4} />
        </>
      ))}
    </Container>
  )
}
