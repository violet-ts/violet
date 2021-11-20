import type { ApiDesk } from '@violet/lib/types/api'
import type {
  BrowserDesk,
  BrowserDir,
  BrowserProject,
  BrowserWork,
  OpenedFullPathDict,
  ProjectApiData,
} from '@violet/web/src/types/browser'
import { getWorkFullName } from '@violet/web/src/utils'
import { fontSizes } from '@violet/web/src/utils/constants'
import React, { useMemo, useState } from 'react'
import { ConfigIcon } from 'src/components/atoms/ConfigIcon'
import { RenameIcon } from 'src/components/atoms/RenameIcon'
import { Spacer } from 'src/components/atoms/Spacer'
import { Modal } from 'src/components/molecules/Modal'
import styled from 'styled-components'
import { IconUpload } from '../IconUpload'
import { ProjectNameUpdate } from '../ProjectNameUpdate'
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

const ProjectArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const StyleIcon = styled.i`
  display: flex;
  align-items: center;
  opacity: 0.2;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
  }
`

const Message = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  white-space: nowrap;
  transform: translate(-50%, -50%);
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
  const [openRename, setOpenRename] = useState(false)
  const [isOpenConfig, setIsOpenConfig] = useState(false)

  const rename = () => {
    setOpenRename(true)
  }

  const closeModal = () => {
    setOpenRename(false)
    setIsOpenConfig(false)
  }

  const openConfig = () => {
    setIsOpenConfig(true)
  }

  return (
    <Container>
      <ProjectArea>
        <ProjectName>{projectApiData.name}</ProjectName>
        <StyleIcon onClick={rename}>
          <RenameIcon />
        </StyleIcon>
        <StyleIcon onClick={openConfig}>
          <Spacer axis="x" size={10} />
          <ConfigIcon size={22} />
        </StyleIcon>
      </ProjectArea>
      {isOpenConfig && (
        <Modal closeModal={closeModal}>
          <Spacer axis="y" size={80} />
          <Message>Upload a project icon images...</Message>
          <IconUpload projectName={projectApiData.name} projectId={projectApiData.projectId} />
        </Modal>
      )}
      {openRename && (
        <Modal closeModal={closeModal}>
          <Spacer axis="y" size={80} />
          <Message>Enter a new project name</Message>
          <ProjectNameUpdate confirmName={closeModal} projectId={projectApiData.projectId} />
        </Modal>
      )}
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
