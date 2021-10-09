import { PrismaClient } from '@prisma/client'
import {
  deskData,
  deskIds,
  projectData,
  projectIds,
  revisionData,
  revisionIds,
  workData,
  workIds,
} from './seedData'

const prisma = new PrismaClient()
/* eslint-disable complexity */
export const main = async () => {
  for (const p of projectData) {
    await prisma.project.upsert({
      where: { projectId: projectIds.id1 || projectIds.id2 },
      update: {},
      create: { projectId: p.projectId, projectName: p.projectName, desks: p.desks },
    })
  }
  for (const d of deskData) {
    await prisma.desk.upsert({
      where: { deskId: deskIds.id1 || deskIds.id2 || deskIds.id3 || deskIds.id4 },
      update: {},
      create: { deskId: d.deskId, deskName: d.deskName, project: d.project },
    })
  }
  for (const w of workData) {
    await prisma.work.upsert({
      where: { workId: workIds.id1 || workIds.id2 || workIds.id3 || workIds.id4 },
      update: {},
      create: { workId: w.workId, workName: w.workName, path: w.path, desk: w.desk },
    })
  }
  for (const r of revisionData) {
    await prisma.revision.upsert({
      where: {
        revisionId: revisionIds.id1 || revisionIds.id2 || revisionIds.id3 || revisionIds.id4,
      },
      update: {},
      create: { revisionId: r.revisionId, work: r.work },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
