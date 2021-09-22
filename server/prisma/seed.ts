import { PrismaClient } from '@prisma/client'
import { uuid } from 'uuidv4'

const prisma = new PrismaClient()
const id = uuid()

export const main = async () => {
  await prisma.project.create({
    data: {
      projectId: id,
      projectName: 'frourio PJ',
      desks: {
        create: {
          deskId: id,
          deskName: 'Desk_1',
          works: {
            createMany: {
              data: [
                {
                  workId: id,
                  workName: 'work_1',
                  path: '',
                },
                {
                  workId: id,
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
      projectId: id,
      projectName: 'violet PJ',
      desks: {
        create: {
          deskId: id,
          deskName: 'Desk_2',
          works: {
            createMany: {
              data: [
                {
                  workId: id,
                  workName: 'work_3',
                  path: '/path1/path3',
                },
                {
                  workId: id,
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
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
