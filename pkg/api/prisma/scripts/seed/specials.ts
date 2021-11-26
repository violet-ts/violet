import type { PrismaClient } from '@prisma/client'
import { dirData, projectData, revisionData, workData } from './specials-data/basic'
import { messageData, replyData } from './specials-data/stream'

export const main = async (prisma: PrismaClient) => {
  await Promise.all(
    projectData.map((p) =>
      prisma.project.upsert({
        where: { projectId: p.projectId },
        update: {},
        create: {
          projectId: p.projectId,
          projectName: p.projectName,
        },
      })
    )
  )

  for (let i = 0; i < dirData.length; i += 1) {
    const d = dirData[i]
    await prisma.dir.upsert({
      where: { dirId: d.dirId },
      update: {},
      create: {
        dirId: d.dirId,
        dirName: d.dirName,
        parentDir: d.parentDir,
        project: d.project,
      },
    })
  }

  await Promise.all(
    workData.map((w) =>
      prisma.work.upsert({
        where: { workId: w.workId },
        update: {},
        create: { workId: w.workId, workName: w.workName, dir: w.dir },
      })
    )
  )

  await Promise.all(
    revisionData.map((r) =>
      prisma.revision.upsert({
        where: { revisionId: r.revisionId },
        update: {},
        create: { revisionId: r.revisionId, work: r.work },
      })
    )
  )

  await Promise.all(
    messageData.map((m) =>
      prisma.message.upsert({
        where: { messageId: m.messageId },
        update: {},
        create: {
          messageId: m.messageId,
          userName: m.userName,
          content: m.content,
          revision: m.revision,
        },
      })
    )
  )

  await Promise.all(
    replyData.map((r) =>
      prisma.reply.upsert({
        where: { replyId: r.replyId },
        update: {},
        create: {
          replyId: r.replyId,
          userName: r.userName,
          content: r.content,
          message: r.message,
        },
      })
    )
  )
}
