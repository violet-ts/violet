import type { Project } from '@prisma/client'
// import type { ApiProject } from '$/types'

export type Methods = {
  get: {
    resBody: Project[]
  }
}
