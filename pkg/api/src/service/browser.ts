import { PrismaClient } from '@prisma/client'
import dotenv from '@violet/api/src/utils/envValues'
import { generateId } from '@violet/lib/generateId'
import type { ApiDesk, ApiProject, ApiRevision, ApiWork } from '@violet/lib/types/api'
import type {
  DeskId,
  MessageId,
  ProjectId,
  RevisionId,
  RevisionPath,
  WorkId,
} from '@violet/lib/types/branded'

const s3Endpoint = dotenv.S3_ENDPOINT
const bucketConverted = dotenv.S3_BUCKET_CONVERTED
const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const

const infoJsonPath = (projectId: ProjectId, deskId: DeskId, revisionId: RevisionId) =>
  `${s3Endpoint}/${bucketConverted}/works/converted/${projectId}/${deskId}/revisions/${revisionId}/info.json` as RevisionPath

export const getProjects = async () => {
  const dbProjects = await prisma.project.findMany(orderByCreatedAtAsc)

  return dbProjects.map((p): ApiProject => ({ id: p.projectId as ProjectId, name: p.projectName }))
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

export const getDesks = async (projectId: ProjectId) => {
  const dbDesks = await prisma.desk.findMany({
    where: { projectId },
    include: { works: orderByCreatedAtAsc },
    ...orderByCreatedAtAsc,
  })

  const desks = dbDesks.map(
    (d): ApiDesk => ({
      id: d.deskId as DeskId,
      name: d.deskName,
      works: d.works.map((w) => ({
        id: w.workId as WorkId,
        name: w.workName,
        ext: w.ext,
        path: w.path,
      })),
    })
  )
  return { projectId, desks }
}

export const createWork = async (
  deskId: DeskId,
  path: ApiWork['path'],
  workName: ApiWork['name'],
  ext?: ApiWork['ext']
): Promise<ApiWork> => {
  const workId = generateId<WorkId>()
  await prisma.work.create({ data: { workId, path, deskId, workName, ext } })

  return { id: workId, name: workName, path, ext }
}

export const getRevisions = async (workId: WorkId) => {
  const dbRevision = await prisma.revision.findMany({
    where: { workId },
    include: { messages: orderByCreatedAtAsc },
    ...orderByCreatedAtAsc,
  })
  const ids = await getPojectIdAndDeskId(workId)

  const revisions = dbRevision.map(
    (r): ApiRevision => ({
      id: r.revisionId as RevisionId,
      url: infoJsonPath(ids.projectId, ids.deskId, r.revisionId as RevisionId),
      messageIds: r.messages.map((m) => m.messageId as MessageId),
    })
  )
  return { workId, revisions }
}

export const createRevision = async (projectId: ProjectId, deskId: DeskId, workId: WorkId) => {
  const revisionId = generateId<RevisionId>()
  const data = await prisma.revision.create({
    data: {
      revisionId,
      workId,
    },
  })

  const apiRevision: ApiRevision = {
    id: data.revisionId as RevisionId,
    url: infoJsonPath(projectId, deskId, data.revisionId as RevisionId),
    messageIds: [],
  }
  return apiRevision
}

const getPojectIdAndDeskId = async (workId: WorkId) => {
  const desk = await prisma.work.findFirst({
    where: { workId },
    select: { deskId: true },
  })
  const project = await prisma.desk.findFirst({
    where: { deskId: desk?.deskId },
    select: { projectId: true },
  })
  return { projectId: project?.projectId as ProjectId, deskId: desk?.deskId as DeskId }
}
