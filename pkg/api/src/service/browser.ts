import { PrismaClient } from '@prisma/client'
import dotenv from '@violet/api/src/utils/envValues'
import { generateId } from '@violet/api/src/utils/generateId'
import type { ApiDesk, ApiProject, ApiRevision, ApiWork } from '@violet/lib/types/api'
import type {
  DeskId,
  MessageId,
  ProjectId,
  RevisionId,
  S3RevisionPath,
  WorkId,
} from '@violet/lib/types/branded'

const s3endpoint = dotenv.S3_ENDPOINT
const bucketConverted = dotenv.S3_BUCKET_CONVERTED
const prisma = new PrismaClient()
export const getProjects = async () => {
  const dbProjects = await prisma.project.findMany({ orderBy: { createdAt: 'asc' } })
  if (!dbProjects) return
  const projects = dbProjects.map<ApiProject>((p) => ({
    id: p.projectId as ProjectId,
    name: p.projectName,
  }))
  return projects
}

export const createProject = async (projectName: ApiProject['name']) => {
  const id = generateId()
  const newProject = await prisma.project.create({
    data: {
      projectId: id,
      projectName,
    },
  })
  const apiProject: ApiProject = {
    id: newProject.projectId as ProjectId,
    name: newProject.projectName,
  }
  return apiProject
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

export const getRevisions = async (projectId: ProjectId, deskId: DeskId, workId: WorkId) => {
  const dbRevision = await prisma.revision.findMany({
    where: { workId },
    include: { message: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'asc' },
  })
  if (!dbRevision) return
  // TODO:Get FileName from info.json
  const revisions = dbRevision.map<ApiRevision>((r) => ({
    ...r,
    id: r.revisionId as RevisionId,
    url: createS3RevisionPath(projectId, deskId, r.revisionId as RevisionId, '0.jpg'),
    editionIds: [],
    messageIds: r.message.map((m) => m.messageId as MessageId),
  }))
  return { workId, revisions }
}
export const createRevision = async (projectId: ProjectId, deskId: DeskId, workId: WorkId) => {
  const revisionId = generateId() as RevisionId
  const data = await prisma.revision.create({
    data: {
      revisionId,
      workId,
    },
  })

  const apiRevision: ApiRevision = {
    id: data.revisionId as RevisionId,
    url: createS3RevisionPath(projectId, deskId, revisionId, '0.jpg'),
    editionIds: [],
    messageIds: [],
  }
  return apiRevision
}

export const createS3RevisionPath = (
  projectId: ProjectId,
  deskId: DeskId,
  revisionId: RevisionId,
  filename: string
) =>
  `${s3endpoint}/${bucketConverted}/works/converted/${projectId}/${deskId}/revisions/${revisionId}/${filename}` as S3RevisionPath
