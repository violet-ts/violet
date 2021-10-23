import type {
  ApiDesk,
  ApiProject,
  ApiRevision,
  ApiWork,
  DeskId,
  EditionId,
  ProjectId,
  RevisionId,
  WorkId,
} from '$/types'
import { generateId } from '$/utils/generateId'
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

export const createWork = async (
  deskId: DeskId,
  path: ApiWork['path'],
  workName: ApiWork['name'],
  ext?: ApiWork['ext']
) => {
  const id = generateId()
  await prisma.work.create({
    data: {
      workId: id,
      path: path,
      deskId: deskId,
      workName: workName,
      ext: ext,
    },
  })
  const newWork = await prisma.work.findFirst({ where: { workId: id } })
  if (!newWork) return
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
