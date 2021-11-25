import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { BrowserProject, ProjectApiData } from '@violet/web/src/types/browser'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { IconUpload } from './IconUpload'
import { ProjectNameUpdate } from './ProjectNameUpdate'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`

const Message = styled.div`
  white-space: nowrap;
`

const Column = styled.div`
  display: flex;
  justify-content: space-between;
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

const SecondaryButton = styled.button`
  padding: 0.3em;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
`

export const ProjectConfig = (props: {
  onComplete: () => void
  projectApiData: ProjectApiData
  project: BrowserProject
}) => {
  const [iconImageFile, setIconImageFile] = useState<File | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const { api, onErr } = useApi()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateProject = async (projectId: ProjectId) => {
    if (!newProjectName && !iconImageFile) return props.onComplete()

    setIsUpdating(true)
    const projectName = newProjectName ? newProjectName : props.project.name
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
    props.onComplete()
    setIsUpdating(false)
  }
  return (
    <Container>
      {isUpdating && <Loading />}
      <Spacer axis="y" size={20} />
      <Message>Project icon</Message>
      <IconUpload projectName={props.projectApiData.name} setIconImageFile={setIconImageFile} />
      <Spacer axis="y" size={20} />
      <Message>Project name</Message>
      <ProjectNameUpdate
        confirmName={props.onComplete}
        projectId={props.projectApiData.projectId}
        setNewProjectName={setNewProjectName}
      />
      <Spacer axis="y" size={10} />
      <Column>
        <UpdateButton onClick={() => updateProject(props.projectApiData.projectId)}>
          Update
        </UpdateButton>
        <Spacer axis="x" size={50} />
        <SecondaryButton onClick={props.onComplete}>Cancel</SecondaryButton>
      </Column>
    </Container>
  )
}
