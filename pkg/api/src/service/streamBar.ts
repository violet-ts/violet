import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/lib/generateId'
import type { ApiMessage, ApiReply } from '@violet/lib/types/api'
import type { MessageId, ReplyId, RevisionId } from '@violet/lib/types/branded'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export const getMessages = async (revisionId: RevisionId) => {
  const dbMessages = await prisma.message.findMany({
    where: { revisionId },
    include: { replies: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })

  const messages = dbMessages.map(
    (m): ApiMessage => ({
      id: m.messageId as MessageId,
      content: m.content,
      createdAt: dayjs(m.createdAt).unix(),
      userName: m.userName,
      replies: m.replies.map((r) => ({
        id: r.replyId as ReplyId,
        content: r.content,
        createdAt: dayjs(r.createdAt).unix(),
        userName: r.userName,
      })),
    })
  )

  return { revisionId, messages }
}

export const createMessage = async (
  revisionId: RevisionId,
  content: ApiMessage['content'],
  userName: ApiMessage['userName']
): Promise<ApiMessage> => {
  const messageId = generateId<MessageId>()
  const newMessage = await prisma.message.create({
    data: { messageId, content, userName, revisionId },
  })

  return {
    id: messageId,
    content,
    createdAt: dayjs(newMessage.createdAt).unix(),
    userName,
    replies: [],
  }
}

export const createReply = async (
  messageId: MessageId,
  content: ApiReply['content'],
  userName: ApiReply['userName']
): Promise<ApiReply> => {
  const replyId = generateId<ReplyId>()
  const newMessage = await prisma.reply.create({ data: { replyId, content, userName, messageId } })

  return { id: replyId, content, createdAt: dayjs(newMessage.createdAt).unix(), userName }
}
