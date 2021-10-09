import { PrismaClient } from '@prisma/client'
import { deskData, projectData, revisionData, workData } from './seedData'

const prisma = new PrismaClient()
/* eslint-disable complexity */
export const main = async () => {
  await Promise.all(
    projectData.map((p) =>
      prisma.project.upsert({
        where: { projectId: p.projectId },
        update: {},
        create: {
          projectId: p.projectId,
          projectName: p.projectName,
          desks: p.desks,
        },
      })
    )
  )

  await Promise.all(
    deskData.map((d) =>
      prisma.desk.upsert({
        where: { deskId: d.deskId },
        create: {
          deskId: d.deskId,
          deskName: d.deskName,
          project: { connect: { projectId: d.project.connect?.projectId } },
        },
        update: {},
      })
    )
  )
  await Promise.all(
    workData.map((w) =>
      prisma.work.upsert({
        where: { workId: w.workId },
        create: { workId: w.workId, workName: w.workName, path: w.path, desk: w.desk },
        update: {},
      })
    )
  )
  await Promise.all(
    revisionData.map((r) =>
      prisma.revision.upsert({
        where: {
          revisionId: r.revisionId,
        },
        update: {},
        create: { revisionId: r.revisionId, work: r.work },
      })
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
