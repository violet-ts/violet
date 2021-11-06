import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/api/src/utils/generateId'
import type {
  ApiDesk,
  ApiProject,
  ApiRevision,
  ApiWork,
  DeskId,
  MessageId,
  ProjectId,
  RevisionId,
  WorkId,
} from '@violet/api/types'

const prisma = new PrismaClient()
export const getProjects = async () => {
  const dbProjects = await prisma.project.findMany()
  if (!dbProjects) return
  const projects = dbProjects.map<ApiProject>((p) => ({
    id: p.projectId as ProjectId,
    name: p.projectName,
  }))
  return projects
}
export const getDesks = async (projectId: ProjectId) => {
  const dbDesk = await prisma.desk.findMany({
    where: { projectId },
    include: { works: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbDesk) return
  const desks = dbDesk.map<ApiDesk>((d) => ({
    ...d,
    id: d.deskId as DeskId,
    name: d.deskName,
    works: d.works.map((w) => ({
      id: w.workId as WorkId,
      name: w.workName,
      ext: w.ext,
      path: w.path,
    })),
  }))
  return { projectId, desks }
}

export const createWork = async (
  deskId: DeskId,
  path: ApiWork['path'],
  workName: ApiWork['name'],
  ext?: ApiWork['ext']
) => {
  const id = generateId()
  const newWork = await prisma.work.create({
    data: {
      workId: id,
      path,
      deskId,
      workName,
      ext,
    },
  })
  const apiWork: ApiWork = {
    id: newWork.workId as WorkId,
    name: newWork.workName,
    path: newWork.path,
    ext: newWork.ext,
  }
  return apiWork
}

export const getRevisions = async (workId: WorkId) => {
  const dbRevision = await prisma.revision.findMany({
    where: { workId },
    include: { message: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbRevision) return
  const revisions = dbRevision.map<ApiRevision>((r) => ({
    ...r,
    id: r.revisionId as RevisionId,
    editionIds: [],
    messageIds: r.message.map((m) => m.messageId as MessageId),
  }))
  return { workId, revisions }
}
export const createRevision = async (workId: WorkId) => {
  const revisionId = generateId()
  const data = await prisma.revision.create({
    data: {
      revisionId,
      workId,
    },
  })

  const apiRevision: ApiRevision = {
    id: data.revisionId as RevisionId,
    editionIds: [],
    messageIds: [],
  }
  return apiRevision
}
export const getDeskId = async (workId: WorkId) => {
  const data = await prisma.work.findFirst({
    where: { workId },
    select: { deskId: true },
  })
  if (!data) return

  return data.deskId as DeskId
}
