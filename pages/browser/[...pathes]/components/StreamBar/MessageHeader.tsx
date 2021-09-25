import React from 'react'
import styled from 'styled-components'
import type { ApiMessage } from '~/server/types'

const Container = styled.div`
  display: flex;
  overflow: hidden;
  font-size: 12px;
`
const Icon = styled.div`
  float: left;
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0;
`
const UserName = styled.div`
  float: left;
  font-weight: bold;
`
const CreateAt = styled.span`
  color: #8a9aa4;
  text-align: right;
`

export const MessageHeader = (props: { message: ApiMessage }) => {
  return (
    <Container>
      <>
        <Icon />
        <UserName>{props.message.userName}</UserName>
        <CreateAt>{props.message.createdAt}</CreateAt>
      </>
    </Container>
  )
}
