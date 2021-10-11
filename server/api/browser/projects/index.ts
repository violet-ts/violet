import type { Project } from '@prisma/client'
// import type { ApiProject } from '$/types'

export type Methods = {
  get: {
    resBody: Project[]
    // resBody: {
    //   id: Pick<Project, 'projectId'>
    //   name: Pick<Project, 'projectName'>
    // }
  }
}
