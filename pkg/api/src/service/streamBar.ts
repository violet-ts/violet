import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/api/src/utils/generateId'
import type { ApiMessage, ApiReply } from '@violet/lib/types/api'
import type { MessageId, ReplyId, RevisionId } from '@violet/lib/types/branded'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export const getMessages = async (revisionId: RevisionId) => {
  const dbMessages = await prisma.message.findMany({
    where: { revisionId },
    include: { reply: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbMessages) return
  const messages = dbMessages.map<ApiMessage>((m) => ({
    ...m,
    id: m.messageId as MessageId,
    content: m.content,
    createdAt: dayjs(m.createdAt).unix(),
    userName: m.userName,
    replys: m.reply.map((r) => ({
      id: r.replyId as ReplyId,
      content: r.content,
      createdAt: dayjs(r.createdAt).unix(),
      userName: r.userName,
    })),
  }))
  return { revisionId, messages }
}

export const createMessage = async (
  revisionId: RevisionId,
  content: ApiMessage['content'],
  userName: ApiMessage['userName']
) => {
  const id = generateId()
  await prisma.message.create({
    data: {
      messageId: id,
      content,
      userName,
      revisionId,
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
  const id = generateId()
  await prisma.reply.create({
    data: {
      replyId: id,
      content,
      userName,
      messageId,
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
