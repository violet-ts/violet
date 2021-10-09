import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'

const prisma = new PrismaClient()

const workId = {
  id1: v4(),
  id2: v4(),
  id3: v4(),
  id4: v4(),
}

const revisionId = {
  id1: v4(),
  id2: v4(),
  id3: v4(),
  id4: v4(),
}

export const main = async () => {
  await prisma.project.create({
    data: {
      projectId: v4(),
      projectName: 'frourio PJ',
      desks: {
        create: {
          deskId: v4(),
          deskName: 'Desk_1',
          works: {
            createMany: {
              data: [
                {
                  workId: workId.id1,
                  workName: 'work_1',
                  path: '',
                },
                {
                  workId: workId.id2,
                  workName: 'work_2',
                  path: '/path1/path2',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.project.create({
    data: {
      projectId: v4(),
      projectName: 'violet PJ',
      desks: {
        create: {
          deskId: v4(),
          deskName: 'Desk_2',
          works: {
            createMany: {
              data: [
                {
                  workId: workId.id3,
                  workName: 'work_3',
                  path: '/path1/path3',
                },
                {
                  workId: workId.id4,
                  workName: 'work_4',
                  path: '/path2/path4',
                },
              ],
            },
          },
        },
      },
    },
  })

  await prisma.revision.createMany({
    data: [
      {
        revisionId: revisionId.id1,
        workId: workId.id1,
      },
      {
        revisionId: revisionId.id2,
        workId: workId.id1,
      },
      {
        revisionId: revisionId.id3,
        workId: workId.id3,
      },
      {
        revisionId: revisionId.id4,
        workId: workId.id3,
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
