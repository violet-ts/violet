/* eslint-disable @typescript-eslint/no-var-requires -- 動的なrequire */
import { PrismaClient } from '@prisma/client'
import arg from 'arg'
import * as fs from 'fs'
import * as path from 'path'
import type { PrismaSeeder } from './types'

const prisma = new PrismaClient()

const args = arg({
  '--seed': String,
  '--prod': Boolean,
})

const seedName = args['--seed'] ?? ''

const prod = async () => {
  console.log('Production mode specified')
  if (!seedName) {
    console.warn('Seed specified but ignored')
  }
  const prodScripts = fs.readdirSync(path.resolve(__dirname, 'prod')).sort()
  for (const s of prodScripts) {
    const scriptPath = `./${path.join('prod', s)}`
    const { main } = require(scriptPath) as { main: PrismaSeeder }
    await main(prisma)
  }
}

const seed = async () => {
  if (!seedName) {
    console.log('No seed specified')
  } else if (/[\w.-]+/.test(seedName)) {
    console.log(`Seed "${seedName}" specified`)
  } else {
    throw new Error(`seed name ${seedName} is invalid`)
  }
  const scriptPath = `./${path.join('seed', seedName)}`
  const { main } = require(scriptPath) as { main: PrismaSeeder }
  await main(prisma)
  console.log(`Seed "${seedName}" successfully applied`)
}

const main = async () => {
  if (args['--prod']) {
    await prod()
  } else {
    await seed()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
