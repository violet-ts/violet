import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const main = async () => {
  console.warn('TODO: do something')
  // ...
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
