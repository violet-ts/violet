import type { Revision, Work } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import dotenv from '@violet/api/src/utils/envValues'
import { generateId } from '@violet/lib/generateId'
import type {
  ApiDir,
  ApiMessage,
  ApiProject,
  ApiReply,
  ApiRevision,
  ApiWork,
  Cursor,
} from '@violet/lib/types/api'
import type { DirId, ProjectId, RevisionId, RevisionPath, WorkId } from '@violet/lib/types/branded'
import {
  getDirId,
  getMessageId,
  getParentDirId,
  getProjectId,
  getRevisionId,
  getWorkId,
} from '../utils/getBrandedId'
import { toApiMessageWithReply } from './streamBar'

const bucketConverted = dotenv.S3_BUCKET_CONVERTED
const endPoint = dotenv.S3_ENDPOINT
  ? `${dotenv.S3_ENDPOINT}/${bucketConverted}`
  : `https://${bucketConverted}.s3.amazonaws.com`

const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const
const orderByWorkNameAsc = { orderBy: { workName: 'asc' } } as const

const infoJsonPath = (projectId: ProjectId, revisionId: RevisionId) =>
  `${endPoint}/works/converted/projects/${projectId}/revisions/${revisionId}/info.json` as RevisionPath

export const getProject = async (projectId: ProjectId): Promise<ApiProject | undefined> => {
  const project = await prisma.project.findFirst({ where: { projectId } })
  if (!project) return undefined

  return { id: projectId, name: project.projectName }
}

export const getProjects = async () => {
  const projects = await prisma.project.findMany(orderByCreatedAtAsc)

  return projects.map((p): ApiProject => ({ id: getProjectId(p), name: p.projectName }))
}

export const createProject = async (projectName: ApiProject['name']) => {
  const projectId = generateId<ProjectId>()
  await prisma.project.create({ data: { projectId, projectName } })

  return { id: projectId, name: projectName }
}

export const updateProject = async (
  projectId: ProjectId,
  projectName: ApiProject['name']
): Promise<ApiProject> => {
  await prisma.project.update({ where: { projectId }, data: { projectName } })

  return { id: projectId, name: projectName }
}

const toApiWork = (w: Work & { revisions: Revision[] }) => ({
  id: getWorkId(w),
  name: w.workName,
  latestRevisionId: w.revisions.length ? (w.revisions[0].revisionId as RevisionId) : null,
})

export const getDirs = async (projectId: ProjectId) => {
  const dirs = await prisma.dir.findMany({
    where: { projectId },
    include: {
      works: {
        ...orderByWorkNameAsc,
        include: { revisions: { take: 1, orderBy: { createdAt: 'desc' } } },
      },
    },
    orderBy: { dirName: 'asc' },
  })

  return dirs.map(
    (d): ApiDir => ({
      id: getDirId(d),
      name: d.dirName,
      parentDirId: getParentDirId(d),
      works: d.works.map(toApiWork),
    })
  )
}

export const createDirs = async (
  projectId: ProjectId,
  parentDirId: ApiDir['parentDirId'],
  names: string[]
) => {
  const ids = names.map(() => generateId<DirId>())
  const dirs = names.map((n, i) => ({
    dirId: ids[i],
    dirName: n,
    projectId,
    parentDirId: i > 0 ? ids[i - 1] : parentDirId,
  }))
  await prisma.dir.createMany({ data: dirs })

  return getDirs(projectId)
}

export const updateDir = async (
  dirId: DirId,
  data: Partial<Pick<ApiDir, 'name' | 'parentDirId'>>
): Promise<ApiDir> => {
  const dir = await prisma.dir.update({
    where: { dirId },
    data,
    include: {
      works: {
        ...orderByWorkNameAsc,
        include: { revisions: { take: 1, orderBy: { createdAt: 'desc' } } },
      },
    },
  })

  return {
    id: dirId,
    name: dir.dirName,
    parentDirId: getParentDirId(dir),
    works: dir.works.map(toApiWork),
  }
}

export const createWork = async (dirId: DirId, workName: ApiWork['name']): Promise<ApiWork[]> => {
  const workId = generateId<WorkId>()
  await prisma.work.create({ data: { workId, dirId, workName } })
  const works = await prisma.work.findMany({
    where: { dirId },
    include: { revisions: { take: 1, orderBy: { createdAt: 'desc' } } },
    ...orderByWorkNameAsc,
  })

  return works.map(toApiWork)
}

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
