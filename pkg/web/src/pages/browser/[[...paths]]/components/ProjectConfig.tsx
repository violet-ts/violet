import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserProject } from '@violet/web/src/types/browser'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useState } from 'react'
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

const Button = styled.button`
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

export const ProjectConfig = (props: { onComplete?: () => void; project: BrowserProject }) => {
  const [iconImageFile, setIconImageFile] = useState<File | undefined>(undefined)
  const [newProjectName, setNewProjectName] = useState('')
  const { updateProject } = useBrowserContext()
  const { api, onErr } = useApiContext()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateProjectName = async (projectId: ProjectId) => {
    if (!newProjectName && !iconImageFile) return props.onComplete?.()

    setIsUpdating(true)
    const projectName = newProjectName ? newProjectName : props.project.name
    const iconExt = iconImageFile?.name.substring(iconImageFile.name.lastIndexOf('.') + 1)
    const projectRes = await api.browser.projects
      ._projectId(projectId)
      .$put({
        body: { name: projectName, iconExt, imageFile: iconImageFile },
      })
      .catch(onErr)
    if (projectRes) updateProject(projectRes)

    setIsUpdating(false)
    return props.onComplete?.()
  }
  return (
    <Container>
      {isUpdating && <Loading />}
      <Spacer axis="y" size={20} />
      <Message>Project icon</Message>
      <IconUpload projectName={props.project.name} setIconImageFile={setIconImageFile} />
      <Spacer axis="y" size={20} />
      <Message>Project name</Message>
      <ProjectNameUpdate
        onConfirmName={props.onComplete}
        projectId={props.project.id}
        setNewProjectName={setNewProjectName}
      />
      <Spacer axis="y" size={10} />
      <Column>
        <Button onClick={() => updateProjectName(props.project.id)}>Update</Button>
        <Spacer axis="x" size={50} />
        <SecondaryButton onClick={props.onComplete}>Cancel</SecondaryButton>
      </Column>
    </Container>
  )
}
