import { PrismaClient } from '@prisma/client'
import dotenv from '@violet/api/src/utils/envValues'
import { generateId } from '@violet/lib/generateId'
import type { ApiMessage, ApiReply, ApiRevision, Cursor } from '@violet/lib/types/api'
import type { ProjectId, RevisionId, RevisionPath, WorkId } from '@violet/lib/types/branded'
import { getMessageId, getRevisionId } from '../../utils/getBrandedId'
import { toApiMessageWithReply } from './../streamBar'

const bucketConverted = dotenv.S3_BUCKET_CONVERTED
const endpoint = dotenv.S3_ENDPOINT
  ? `${dotenv.S3_ENDPOINT}/${bucketConverted}`
  : `https://${bucketConverted}.s3.amazonaws.com`
const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const
const infoJsonPath = (projectId: ProjectId, revisionId: RevisionId) =>
  `${endpoint}/works/converted/projects/${projectId}/revisions/${revisionId}/info.json` as RevisionPath

export const getRevisions = async (
  projectId: ProjectId,
  workId: WorkId,
  { take, cursorId, skipCursor }: Cursor<RevisionId>
) => {
  const revisions = await prisma.revision.findMany({
    skip: +skipCursor,
    take,
    cursor: { revisionId: cursorId },
    where: { workId },
    include: {
      messages: { ...orderByCreatedAtAsc, take: 10, include: { replies: orderByCreatedAtAsc } },
    },
    ...orderByCreatedAtAsc,
  })

  return revisions.map(
    (r): ApiRevision & { messages: (ApiMessage & { replies: ApiReply[] })[] } => ({
      id: getRevisionId(r),
      url: infoJsonPath(projectId, getRevisionId(r)),
      latestMessageId: r.messages.length > 0 ? getMessageId(r.messages[0]) : null,
      messages: r.messages.map(toApiMessageWithReply),
    })
  )
}

export const createRevision = async (
  projectId: ProjectId,
  workId: WorkId
): Promise<ApiRevision> => {
  const revisionId = generateId<RevisionId>()
  await prisma.revision.create({ data: { revisionId, workId } })

  return { id: revisionId, url: infoJsonPath(projectId, revisionId), latestMessageId: null }
}
