import type { Message, Reply } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/lib/generateId'
import type { ApiMessage, ApiReply, Cursor } from '@violet/lib/types/api'
import type { MessageId, ReplyId, RevisionId } from '@violet/lib/types/branded'
import dayjs from 'dayjs'
import { getMessageId, getReplyId } from '../utils/getBrandedId'

const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const
const toApiReply = (r: Reply): ApiReply => ({
  id: getReplyId(r),
  content: r.content,
  createdAt: dayjs(r.createdAt).unix(),
  userName: r.userName,
})

export const toApiMessageWithReply = (
  m: Message & { replies: Reply[] }
): ApiMessage & { replies: ApiReply[] } => ({
  id: getMessageId(m),
  content: m.content,
  createdAt: dayjs(m.createdAt).unix(),
  userName: m.userName,
  latestReplyId: m.replies.length > 0 ? getReplyId(m.replies[0]) : null,
  replies: m.replies.map(toApiReply),
})

export const getMessages = async (
  revisionId: RevisionId,
  { take, cursorId, skipCursor }: Cursor<MessageId>
) => {
  const messages = await prisma.message.findMany({
    skip: +skipCursor,
    take,
    cursor: { messageId: cursorId },
    where: { revisionId },
    include: { replies: orderByCreatedAtAsc },
    ...orderByCreatedAtAsc,
  })

  return messages.map(toApiMessageWithReply)
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
    latestReplyId: null,
  }
}

export const getReplies = async (
  messageId: MessageId,
  { take, cursorId, skipCursor }: Cursor<ReplyId>
) => {
  const replies = await prisma.reply.findMany({
    skip: +skipCursor,
    take,
    cursor: { replyId: cursorId },
    where: { messageId },
    ...orderByCreatedAtAsc,
  })

  return replies.map(toApiReply)
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
