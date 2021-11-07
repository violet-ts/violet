const arg = require('arg')
const fs = require('fs')
const path = require('path')

const args = arg({
  '--seed': String,
  '--prod': Boolean,
})

const seedName = args['--seed']

const prod = async () => {
  console.log('Production mode specified')
  if (!seedName) {
    console.warn('Seed specified but ignored')
  }
  const prodScripts = fs.readdirSync(path.resolve(__dirname, 'build/prod')).sort()
  for (const s of prodScripts) {
    // NOTE(security): prevent directory traversal
    const scriptPath = `./${path.join('build/prod', s)}`
    const { main } = require(scriptPath)
    await main()
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
  // NOTE(security): prevent directory traversal
  const scriptPath = `./${path.join('build/seed', seedName)}`
  const { main } = require(scriptPath)
  await main()
}

const main = async () => {
  if (args['--prod']) {
    await prod()
  } else {
    await seed()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
