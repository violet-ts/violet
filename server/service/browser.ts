import type {
  ApiDesk,
  ApiProject,
  ApiRevision,
  DeskId,
  EditionId,
  ProjectId,
  RevisionId,
  WorkId,
} from '$/types'
import { generateId } from '$/utils/generateId'
import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

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
    where: { projectId: projectId },
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
export const getRevisions = async (workId: WorkId) => {
  const dbRevision = await prisma.revision.findMany({
    where: { workId: workId },
    include: { editions: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbRevision) return
  const revisions = dbRevision.map<ApiRevision>((r) => ({
    ...r,
    id: r.revisionId as RevisionId,
    editions: r.editions.map((e) => ({
      id: e.editionId as EditionId,
    })),
    messages: [],
  }))
  return { workId, revisions }
}
export const createRevision = async (workId: WorkId) => {
  const id = generateId()
  const data = await prisma.revision
    .create({
      data: {
        revisionId: id,
        workId: workId,
      },
    })
    .catch((e: Prisma.PrismaClientUnknownRequestError) => {
      console.log(e)
      throw e
    })

  const apiRevision: ApiRevision = {
    id: data.revisionId as RevisionId,
    editions: [],
    messages: [],
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
