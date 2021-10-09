import dayjs from 'dayjs'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin-top: 8px;
  margin-left: 8px;
  overflow: hidden;
  font-size: 12px;
`
const Icon = styled.img`
  float: left;
  width: 36px;
  height: 36px;
  border-radius: 18px;
`
const UserName = styled.div`
  float: left;
  margin-top: 12px;
  margin-left: 8px;
  font-weight: bold;
`
const CreateAt = styled.span`
  margin-top: 12px;
  margin-left: 12px;
  font-size: 8px;
  color: #8a9aa4;
  text-align: right;
`

export const MessageHeader = (props: { userName: string; createdAt: number }) => {
  const timeStamp = dayjs(props.createdAt * 1000)
  const createAt = dayjs(timeStamp).format('YYYY/MM/DD HH:mm:ss')
  const src = 'https://placehold.jp/32x32.png'
  return (
    <Container>
      <Icon src={src} />
      <UserName>{props.userName}</UserName>
      <CreateAt>{createAt}</CreateAt>
    </Container>
  )
}
