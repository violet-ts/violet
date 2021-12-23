import type { ApiProject } from '@violet/lib/types/api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${fontSizes.small};
  font-weight: bold;
  color: ${colors.white};
  background: ${colors.blue};
  border-radius: 6px;
`

const IconWrapper = styled.div`
  display: inline-block;
  width: 36px;
  height: 36px;
  padding: 2px;
  cursor: default;
  border-radius: 8px;
  transition: border-color 0.2s;
`

const UploadedIcon = styled.img`
  width: 36px;
  height: 36px;
  margin: 4px;
  border-radius: 8px;
`

const IconImageUrl = (props: { projects: ApiProject[]; project: ApiProject }) => {
  const iconUrl = props.projects.find((d) => d.id === props.project.id)?.iconUrl
  return iconUrl ? (
    <UploadedIcon src={iconUrl} />
  ) : (
    <IconWrapper>
      <Icon>{props.project.name.slice(0, 2)}</Icon>
    </IconWrapper>
  )
}

interface Props {
  project: ApiProject
  iconImageFile: File | undefined
}

export const IconUpload: React.FC<Props> = ({ project, iconImageFile }: Props) => {
  const { projects } = useBrowserContext()
  const [objectURL, setObjectURL] = useState<string | null>(null)
  useEffect(() => {
    let iconImageUrl = ''
    if (iconImageFile) iconImageUrl = URL.createObjectURL(iconImageFile)
    setObjectURL(iconImageUrl)
    return () => {
      URL.revokeObjectURL(iconImageUrl)
      setObjectURL(null)
    }
  }, [iconImageFile])

  return (
    <Container>
      {objectURL ? (
        <UploadedIcon src={objectURL} />
      ) : (
        <IconImageUrl projects={projects} project={project} />
      )}
    </Container>
  )
}
