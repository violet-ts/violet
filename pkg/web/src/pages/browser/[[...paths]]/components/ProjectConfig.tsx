import { acceptImageExtensions } from '@violet/def/constants'
import type { ProjectId } from '@violet/lib/types/branded'
import { ImageIcon } from '@violet/web/src/components/atoms/ImageIcon'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserProject } from '@violet/web/src/types/browser'
import { parsePath } from '@violet/web/src/utils'
import { pagesPath } from '@violet/web/src/utils/$path'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/router'
import type { ChangeEvent } from 'react'
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

const StyleInput = styled.input`
  display: none;
`

const StyleImageIcon = styled.label`
  opacity: 0.2;
  transition: opacity 0.5s;

  &:hover {
    opacity: 1;
  }
`

const StyleProjectIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`

export const ProjectConfig = (props: { onComplete?: () => void; project: BrowserProject }) => {
  const [iconImageFile, setIconImageFile] = useState<File>()
  const [newProjectName, setNewProjectName] = useState('')
  const { updateProject } = useBrowserContext()
  const { api, onErr } = useApiContext()
  const { push, asPath } = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const updateProjectNameAndIcon = async (projectId: ProjectId) => {
    if (!newProjectName && !iconImageFile) return props.onComplete?.()

    setIsUpdating(true)
    const projectName = newProjectName ? newProjectName : props.project.name
    const { dirOrWorkNames } = parsePath(asPath)
    const iconName = createIconName()
    const projectRes = await api.browser.projects
      ._projectId(projectId)
      .$put({
        body: { name: projectName, iconName, imageFile: iconImageFile },
      })
      .catch(onErr)
    setIsUpdating(false)
    props.onComplete?.()
    if (projectRes) {
      updateProject(projectRes)
      await push(pagesPath.browser._paths([projectName, ...dirOrWorkNames]).$url())
    }

    return undefined
  }

  const createIconName = () => {
    if (!iconImageFile) return props.project.iconUrl?.split('/').slice(-1)[0] ?? null

    return `${Date.now()}.${iconImageFile.name.substring(iconImageFile.name.lastIndexOf('.') + 1)}`
  }

  const loadImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return

    const imageFile = e.target.files[0]
    setIconImageFile(imageFile)
  }

  return (
    <Container>
      {isUpdating && <Loading />}
      <Spacer axis="y" size={20} />
      <Message>Project icon</Message>
      <StyleProjectIcon>
        <IconUpload project={props.project} iconImageFile={iconImageFile} />
        <Spacer axis="x" size={10} />
        <StyleImageIcon>
          <ImageIcon />
          <StyleInput type="file" accept={acceptImageExtensions} onChange={loadImageFile} />
        </StyleImageIcon>
      </StyleProjectIcon>
      <Spacer axis="y" size={20} />
      <Message>Project name</Message>
      <ProjectNameUpdate
        onConfirmName={props.onComplete}
        projectId={props.project.id}
        setNewProjectName={setNewProjectName}
      />
      <Spacer axis="y" size={10} />
      <Column>
        <Button onClick={() => updateProjectNameAndIcon(props.project.id)}>Update</Button>
        <Spacer axis="x" size={50} />
        <SecondaryButton onClick={props.onComplete}>Cancel</SecondaryButton>
      </Column>
    </Container>
  )
}
