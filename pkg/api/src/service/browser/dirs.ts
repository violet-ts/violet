import type { Revision, Work } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/lib/generateId'
import type { ApiDir } from '@violet/lib/types/api'
import type { DirId, ProjectId, RevisionId } from '@violet/lib/types/branded'
import { getDirId, getParentDirId, getWorkId } from '../../utils/getBrandedId'

const prisma = new PrismaClient()
const orderByWorkNameAsc = { orderBy: { workName: 'asc' } } as const
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
