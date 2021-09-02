import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import type { ApiTreeProject, ApiTreeWork } from '~/server/types'
import { getDeskByWork, getWorkFullName } from '~/utils'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'
import { CellName } from './CellName'
import { DirectoryCell } from './DirectoryCell'
import { DeskData, DirData, WorkData } from './types'
import { WorkCell } from './WorkCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
  background: ${colors.violet}${alphaLevel[1]};
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

type OpenedFullPathes = Record<string, boolean | undefined>
type Params = {
  deskName: string
  openedFullPathes: OpenedFullPathes
  selectedFullPath: string
  works: ApiTreeWork[]
  path: string
}

const createData = (params: Params): [DirData | WorkData, number] => {
  if (params.works[0].path === params.path) {
    const fullPath = `${params.deskName}${params.path}/${getWorkFullName(params.works[0])}`

    return [
      {
        type: 'work',
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
  })
  const fullPath = `${params.deskName}${params.path}/${name}`

  return [
    {
      type: 'dir',
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

export const Explorer = ({
  project,
  selectedWork,
  onSelect,
}: {
  project: ApiTreeProject
  selectedWork?: ApiTreeWork
  onSelect: (work?: ApiTreeWork) => void
}) => {
  const [openedFullPathes, setOpenedFullPathes] = useState<OpenedFullPathes>({})
  const [selectedData, setSelectedData] = useState<DeskData | DirData | WorkData>()
  const onClickCellName = (data: DeskData | DirData | WorkData) => {
    if (data.type === 'work' && selectedData?.fullPath === data.fullPath) return

    onSelect(data.type === 'work' ? data : undefined)
    setSelectedData(data)
    setOpenedFullPathes((f) => ({ ...f, [data.fullPath]: !f[data.fullPath] }))
  }
  const nestedDesks = useMemo(
    () =>
      project.desks.map<DeskData>(({ works, ...d }) => ({
        type: 'desk',
        ...d,
        fullPath: d.name,
        data: nestWorks({
          deskName: d.name,
          openedFullPathes,
          selectedFullPath: selectedData?.fullPath ?? '',
          works,
          path: '',
        })[0],
      })),
    [project.desks, openedFullPathes, selectedData]
  )

  useEffect(() => {
    if (!selectedWork) return

    const fullPath = `${getDeskByWork(project.desks, selectedWork).name}${
      selectedWork.path
    }/${getWorkFullName(selectedWork)}`

    setSelectedData({ type: 'work', ...selectedWork, fullPath, selected: true })
    setOpenedFullPathes((f) =>
      Object.keys(f).reduce<OpenedFullPathes>(
        (p, k) => ({ ...p, [k]: fullPath.startsWith(k) || f[k] }),
        {}
      )
    )
  }, [project.desks, selectedWork])

  return (
    <Container>
      <ProjectName>{project.name}</ProjectName>
      <TreeViewer>
        {nestedDesks.map((desk) => (
          <React.Fragment key={desk.id}>
            <CellName
              fullPath={desk.fullPath}
              name={desk.name}
              selected={selectedData?.fullPath === desk.fullPath}
              opened={openedFullPathes[desk.fullPath]}
              bold
              onClick={() => onClickCellName(desk)}
            />
            {openedFullPathes[desk.name] &&
              desk.data.map((d, i) =>
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
