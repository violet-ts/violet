import React, { useMemo } from 'react'
import styled from 'styled-components'
import type {
  ApiDesk,
  BrowserDesk,
  BrowserDir,
  BrowserProject,
  BrowserWork,
  OpenedFullPathDict,
  ProjectApiData,
} from '~/server/types'
import { getWorkFullName } from '~/utils'
import { fontSizes } from '~/utils/constants'
import { CellName } from './CellName'
import { DirectoryCell } from './DirectoryCell'
import { WorkCell } from './WorkCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`

const ProjectName = styled.div`
  padding: 12px;
  font-size: ${fontSizes.midium};
  font-weight: bold;
`

const TreeViewer = styled.div`
  flex: 1;
  overflow: auto;
`

type Params = {
  prefixPath: string
  openedFullPathDict: OpenedFullPathDict
  selectedFullPath: string
  apiWorks: ApiDesk['works']
  path: string
}

const createData = (params: Params): [BrowserDir | BrowserWork, number] => {
  if (params.apiWorks[0].path === params.path) {
    const fullPath = `${params.prefixPath}${params.path}/${getWorkFullName(params.apiWorks[0])}`

    return [
      {
        type: 'work',
        fullPath,
        selected: params.selectedFullPath === fullPath,
        ...params.apiWorks[0],
      },
      1,
    ]
  }

  const [, name] = params.apiWorks[0].path.replace(params.path, '').split('/')
  const [children, n] = nestWorks({
    ...params,
    path: `${params.path}/${name}`,
  })
  const fullPath = `${params.prefixPath}${params.path}/${name}`

  return [
    {
      type: 'dir',
      fullPath,
      selected: params.selectedFullPath === fullPath,
      opened: params.openedFullPathDict[fullPath],
      name,
      children,
    },
    n,
  ]
}

const nestWorks = (params: Params) => {
  const nested: (BrowserDir | BrowserWork)[] = []
  let n = 0

  while (params.apiWorks[n]?.path.startsWith(params.path)) {
    const [data, m] = createData({ ...params, apiWorks: params.apiWorks.slice(n) })
    nested.push(data)
    n += m
  }

  return [nested, n] as const
}

export const Explorer = ({
  projectApiData,
  project,
}: {
  projectApiData: ProjectApiData
  project: BrowserProject
}) => {
  const nestedDesks = useMemo(
    () =>
      projectApiData.desks.map<BrowserDesk>(({ works, ...d }) => ({
        type: 'desk',
        ...d,
        fullPath: `${project.id}/${d.name}`,
        opened: false,
        selected: false,
        children: nestWorks({
          prefixPath: `${project.id}/${d.name}`,
          openedFullPathDict: project.openedFullPathDict,
          selectedFullPath: project.selectedFullPath ?? '',
          apiWorks: works,
          path: '',
        })[0],
      })),
    [projectApiData.desks, project.openedFullPathDict, project.selectedFullPath]
  )

  return (
    <Container>
      <ProjectName>{projectApiData.name}</ProjectName>
      <TreeViewer>
        {nestedDesks.map((desk) => (
          <React.Fragment key={desk.id}>
            <CellName
              fullPath={desk.fullPath}
              name={desk.name}
              selected={project.selectedFullPath === desk.fullPath}
              opened={project.openedFullPathDict[desk.fullPath]}
              bold
            />
            {project.openedFullPathDict[desk.fullPath] &&
              desk.children.map((d, i) =>
                d.type === 'dir' ? <DirectoryCell key={i} dir={d} /> : <WorkCell key={i} work={d} />
              )}
          </React.Fragment>
        ))}
      </TreeViewer>
    </Container>
  )
}
