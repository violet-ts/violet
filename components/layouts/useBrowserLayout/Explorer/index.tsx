import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { ApiTree, ApiTreeWork } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'
import { CellName } from './CellName'
import { DirectoryCell } from './DirectoryCell'
import { WorkCell } from './WorkCell'

export type WorkData = {
  type: 'work'
  depth: number
  fullPath: string
  selected: boolean
} & ApiTreeWork

export type DirData = {
  type: 'dir'
  depth: number
  fullPath: string
  selected: boolean
  opened?: boolean
  name: string
  children: (DirData | WorkData)[]
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${colors.violet}${alphaLevel[1]};
`

const ProjectName = styled.div`
  font-size: ${fontSizes.midium};
`

const TreeViewer = styled.div`
  flex: 1;
  overflow: auto;
  user-select: none;
`

type OpenedFullPathes = Record<string, boolean | undefined>
type Params = {
  deskName: string
  openedFullPathes: OpenedFullPathes
  selectedFullPath: string
  works: ApiTreeWork[]
  path: string
  depth: number
}

const createData = (params: Params): [DirData | WorkData, number] => {
  if (params.works[0].path === params.path) {
    const fullPath = `${params.deskName}${params.path}/${getWorkFullName(params.works[0])}`

    return [
      {
        type: 'work',
        depth: params.depth,
        fullPath,
        selected: params.selectedFullPath === fullPath,
        ...params.works[0],
      },
      1,
    ]
  }

  const [, name] = params.works[0].path.replace(params.path, '').split('/')
  const [children, n] = nestWorks({
    ...params,
    path: `${params.path}/${name}`,
    depth: params.depth + 1,
  })
  const fullPath = `${params.deskName}${params.path}/${name}`

  return [
    {
      type: 'dir',
      depth: params.depth,
      fullPath,
      selected: params.selectedFullPath === fullPath,
      opened: params.openedFullPathes[fullPath],
      name,
      children,
    },
    n,
  ]
}

const nestWorks = (params: Params) => {
  const nested: (DirData | WorkData)[] = []
  let n = 0

  while (params.works[n]?.path.startsWith(params.path)) {
    const [data, m] = createData({ ...params, works: params.works.slice(n) })
    nested.push(data)
    n += m
  }

  return [nested, n] as const
}

export const Explorer = ({ tree }: { tree: ApiTree }) => {
  const [openedFullPathes, setOpenedFullPathes] = useState<OpenedFullPathes>({})
  const [selectedFullPath, setSelectedFullPath] = useState(tree.desks[0]?.name ?? '')
  const onClickCellName = (fullPath: string) => {
    setSelectedFullPath(fullPath)
    setOpenedFullPathes((f) => ({ ...f, [fullPath]: !f[fullPath] }))
  }
  const nestedDesks = useMemo(
    () =>
      tree.desks.map(({ works, ...d }) => ({
        ...d,
        nestedWorks: nestWorks({
          deskName: d.name,
          openedFullPathes,
          selectedFullPath,
          works,
          path: '',
          depth: 2,
        })[0],
      })),
    [tree.desks, openedFullPathes, selectedFullPath]
  )

  return (
    <Container>
      <ProjectName>{tree.name}</ProjectName>
      <Spacer axis="y" size={16} />
      <TreeViewer>
        {nestedDesks.map((desk) => (
          <React.Fragment key={desk.id}>
            <CellName
              depth={1}
              name={desk.name}
              selected={selectedFullPath === desk.name}
              opened={openedFullPathes[desk.name]}
              bold
              onClick={() => onClickCellName(desk.name)}
            />
            {openedFullPathes[desk.name] &&
              desk.nestedWorks.map((d, i) =>
                d.type === 'dir' ? (
                  <DirectoryCell key={i} dir={d} onClickCellName={onClickCellName} />
                ) : (
                  <WorkCell key={i} work={d} onClickCellName={onClickCellName} />
                )
              )}
          </React.Fragment>
        ))}
      </TreeViewer>
    </Container>
  )
}
