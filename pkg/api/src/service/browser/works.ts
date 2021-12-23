import type { Revision, Work } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { generateId } from '@violet/lib/generateId'
import type { ApiWork } from '@violet/lib/types/api'
import type { DirId, RevisionId, WorkId } from '@violet/lib/types/branded'
import { getWorkId } from '../../utils/getBrandedId'

const prisma = new PrismaClient()
const orderByWorkNameAsc = { orderBy: { workName: 'asc' } } as const
const toApiWork = (w: Work & { revisions: Revision[] }) => ({
  id: getWorkId(w),
  name: w.workName,
  latestRevisionId: w.revisions.length ? (w.revisions[0].revisionId as RevisionId) : null,
})

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
