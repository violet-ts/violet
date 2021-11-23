import type { ApiDesk } from '@violet/lib/types/api'
import type { ProjectId } from '@violet/lib/types/branded'
import { ConfigIcon } from '@violet/web/src/components/atoms/ConfigIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type {
  BrowserDesk,
  BrowserDir,
  BrowserProject,
  BrowserWork,
  OpenedFullPathDict,
  ProjectApiData,
} from '@violet/web/src/types/browser'
import { getWorkFullName } from '@violet/web/src/utils'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useContext, useMemo, useState } from 'react'
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

const Column = styled.div`
  display: flex;
  justify-content: space-between;
`

const SecondaryButton = styled.button`
  padding: 0.3em;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
`

const UpdateButton = styled.button`
  padding: 0.3em;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.green};
  border: none;
  border-radius: 16px;
`

const ProjectName = styled.div`
  padding: 12px;
  font-size: ${fontSizes.medium};
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
  white-space: nowrap;
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
  const [openConfiguration, setOpenConfiguration] = useState(false)
  const [iconImageFile, setIconImageFile] = useState<File | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const { api, onErr } = useApi()

  const closeModal = () => {
    setOpenConfiguration(false)
  }

  const openConfigModal = () => {
    setOpenConfiguration(true)
  }

  const updateProject = async (projectId: ProjectId) => {
    if (!newProjectName && !iconImageFile) return

    const projectName = newProjectName ? newProjectName : project.name
    const iconExt = iconImageFile?.name.substring(iconImageFile.name.indexOf('.') + 1)
    const projectData = await api.browser.projects
      ._projectId(projectId)
      .put({
        body: { projectName, iconExt, imageFile: iconImageFile as File },
      })
      .catch(onErr)
    if (!projectData) return

    const projectsData = apiWholeData.projects.map((d) =>
      d.id === projectId ? projectData.body : d
    )
    const projectsStatus = projects.map((d) =>
      d.id === projectId ? { ...d, name: projectData.body.name } : d
    )
    updateApiWholeData('projects', projectsData)
    updateProjects(projectsStatus)
    setOpenConfiguration(false)
  }

  return (
    <Container>
      <ProjectArea>
        <ProjectName>{projectApiData.name}</ProjectName>
        <StyleIcon onClick={openConfigModal}>
          <ConfigIcon size={22} />
        </StyleIcon>
      </ProjectArea>
      <CardModal onClose={closeModal} open={openConfiguration}>
        <Spacer axis="y" size={20} />
        <Message>Project icon</Message>
        <IconUpload projectName={projectApiData.name} setIconImageFile={setIconImageFile} />
        <Spacer axis="y" size={20} />
        <Message>Project name</Message>
        <ProjectNameUpdate
          confirmName={closeModal}
          projectId={projectApiData.projectId}
          setNewProjectName={setNewProjectName}
        />
        <Spacer axis="y" size={10} />
        <Column>
          <UpdateButton onClick={() => updateProject(projectApiData.projectId)}>
            Update
          </UpdateButton>
          <Spacer axis="x" size={50} />
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
        </Column>
      </CardModal>
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
