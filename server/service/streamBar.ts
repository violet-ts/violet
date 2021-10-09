import type { ApiMessage, ApiReply, MessageId, ReplyId, RevisionId } from '$/types'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export const getMessages = async (revisionId: RevisionId) => {
  const dbMessages = await prisma.message.findMany({
    where: { revisionId: revisionId },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbMessages) return
  const messages = dbMessages.map<ApiMessage>((m) => ({
    ...m,
    id: m.messageId as MessageId,
    content: m.content,
    createdAt: Math.floor(m.createdAt.getTime() / 1000),
    userName: m.userName,
    replys: [],
  }))
  return { revisionId, messages }
}

export const createMessage = async (
  revisionId: RevisionId,
  content: ApiMessage['content'],
  userName: ApiMessage['userName']
) => {
  const id = uuidv4()
  await prisma.message.create({
    data: {
      messageId: id,
      content: content,
      userName: userName,
      revisionId: revisionId,
    },
  })
  const newMessage = await prisma.message.findFirst({ where: { messageId: id } })
  if (!newMessage) return
  const apiMessage: ApiMessage = {
    id: newMessage.messageId as MessageId,
    content: newMessage.content,
    createdAt: dayjs(newMessage.createdAt).unix(),
    userName: newMessage.userName,
    replys: [],
  }
  return apiMessage
}

export const createReply = async (
  messageId: MessageId,
  content: ApiReply['content'],
  userName: ApiReply['userName']
) => {
  const id = uuidv4()
  await prisma.reply.create({
    data: {
      replyId: id,
      content: content,
      userName: userName,
      messageId: messageId,
    },
  })
  const newMessage = await prisma.reply.findFirst({ where: { replyId: id } })
  if (!newMessage) return
  const apiReply: ApiReply = {
    id: newMessage.replyId as ReplyId,
    content: newMessage.content,
    createdAt: dayjs(newMessage.createdAt).unix(),
    userName: newMessage.userName,
  }
  return apiReply
}
