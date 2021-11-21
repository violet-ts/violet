import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/lib/generateId'
import type { ApiDesk, ApiProject, ApiRevision, ApiWork } from '@violet/lib/types/api'
import type { DeskId, MessageId, ProjectId, RevisionId, WorkId } from '@violet/lib/types/branded'

const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const

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

  const revisions = dbRevision.map(
    (r): ApiRevision => ({
      id: r.revisionId as RevisionId,
      messageIds: r.messages.map((m) => m.messageId as MessageId),
    })
  )

  return { workId, revisions }
}

export const createRevision = async (workId: WorkId): Promise<ApiRevision> => {
  const revisionId = generateId<RevisionId>()
  await prisma.revision.create({ data: { revisionId, workId } })

  return { id: revisionId, messageIds: [] }
}

export const getDeskId = async (workId: WorkId) => {
  const data = await prisma.work.findFirst({ where: { workId }, select: { deskId: true } })
  if (!data) return

  return data.deskId as DeskId
}
