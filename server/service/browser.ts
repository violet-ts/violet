import type {
  ApiDesk,
  ApiRevision,
  DeskId,
  EditionId,
  ProjectId,
  RevisionId,
  WorkId,
} from '$/types'
import { generateId } from '$/utils/generateId'
import type { Project } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { depend } from 'velona'

const prisma = new PrismaClient()

export const getProjects = depend(
  { prisma: prisma as { project: { findMany(): Promise<Project[]> } } },
  async ({ prisma }) => await prisma.project.findMany()
)
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
  await prisma.revision.create({
    data: {
      revisionId: id,
      workId: workId,
    },
  })
  const newRevision = await prisma.revision.findFirst({
    where: { revisionId: id },
  })
  if (!newRevision) return
  const apiRevision: ApiRevision = {
    id: newRevision.revisionId as RevisionId,
    editions: [],
    messages: [],
  }
  return apiRevision
}
