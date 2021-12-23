import { PrismaClient } from '@prisma/client'
import { sendNewProjectIcon } from '@violet/api/src/service/s3'
import dotenv from '@violet/api/src/utils/envValues'
import { createS3SaveProjectIconPath } from '@violet/api/src/utils/s3'
import { generateId } from '@violet/lib/generateId'
import type { ApiProject } from '@violet/lib/types/api'
import type { ProjectIconPath, ProjectId } from '@violet/lib/types/branded'
import type { MultipartFile } from 'fastify-multipart'
import { getProjectId } from '../../utils/getBrandedId'

const bucketOriginal = dotenv.S3_BUCKET_ORIGINAL
const prisma = new PrismaClient()
const orderByCreatedAtAsc = { orderBy: { createdAt: 'asc' } } as const

export const getProject = async (projectId: ProjectId): Promise<ApiProject | undefined> => {
  const project = await prisma.project.findFirst({ where: { projectId } })
  if (!project) return undefined

  return { id: projectId, name: project.projectName }
}

export const getProjects = async () => {
  const projects = await prisma.project.findMany(orderByCreatedAtAsc)

  return projects.map(
    (p): ApiProject => ({
      id: getProjectId(p),
      name: p.projectName,
      iconUrl: createProjectIconPath(p.iconName, p.projectId),
    })
  )
}

export const createProject = async (projectName: ApiProject['name']) => {
  const projectId = generateId<ProjectId>()
  await prisma.project.create({ data: { projectId, projectName } })

  return { id: projectId, name: projectName, iconUrl: null }
}

export const updateProject = async (
  projectId: ProjectId,
  projectName: ApiProject['name'],
  iconName?: string,
  imageFile?: MultipartFile
): Promise<ApiProject> => {
  await prisma.project.update({ where: { projectId }, data: { projectName, iconName } })
  if (imageFile) {
    await sendNewProjectIcon({
      imageFile,
      path: await createS3SaveProjectIconPath({
        projectId: projectId as ProjectId,
        iconName,
      }),
    })
  }

  return {
    id: projectId,
    name: projectName,
    iconUrl: createProjectIconPath(iconName, projectName),
  }
}

export const createProjectIconPath = (
  iconName: string | undefined,
  projectId: string | undefined
) =>
  iconName
    ? (`${dotenv.S3_ENDPOINT}/${bucketOriginal}/icon/${projectId}/${iconName}` as ProjectIconPath)
    : undefined
