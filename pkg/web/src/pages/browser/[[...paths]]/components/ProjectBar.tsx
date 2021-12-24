import type { ProjectId } from '@violet/lib/types/branded'
import { PlusIcon } from '@violet/web/src/components/atoms/PlusIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  DirsDictForProjectId,
  OperationData,
  WorksDictForProjectId,
} from '@violet/web/src/types/browser'
import { tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors, fontSizes } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import { ProjectNameInput } from './ProjectNameInput'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  height: 100vh;
  padding: 6px;
  user-select: none;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
`

const Column = styled.div`
  display: flex;
  justify-content: end;
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

const alpha = (selected: boolean) => (selected ? alphaLevel[5] : alphaLevel[3])

const IconWrapper = styled.a<{ selected: boolean }>`
  display: inline-block;
  width: 36px;
  height: 36px;
  padding: 2px;
  cursor: pointer;
  border: 3px solid
    ${(props) => (props.selected ? `${colors.violet}${alpha(true)}` : colors.transparent)};
  border-radius: 8px;
  transition: border-color 0.2s;

  :hover {
    border-color: ${colors.violet}${(props) => alpha(props.selected)};
  }
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

const Message = styled.div`
  white-space: nowrap;
`
const StyleIconImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const IconImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 6px;
`

export const ProjectBar = (props: {
  projects: BrowserProject[]
  currentProject: BrowserProject | undefined
  operationDataDict: Record<ProjectId, OperationData>
  dirsDictForProjectId: DirsDictForProjectId
  worksDictForProjectId: WorksDictForProjectId
}) => {
  const [isClickAddProject, setIsClickAddProject] = useState(false)
  const { projects } = useBrowserContext()

  const addNewProject = () => {
    setIsClickAddProject(true)
  }

  const closeModal = () => {
    setIsClickAddProject(false)
  }

  const getIconImageUrl = (projectId: ProjectId) => {
    return projects.find((d) => d.id === projectId)?.iconUrl ?? undefined
  }

  return (
    <Container>
      {props.projects.map((p) => (
        <Link
          key={p.id}
          href={tabToHref(
            props.operationDataDict[p.id].activeTab,
            p,
            props.dirsDictForProjectId[p.id],
            props.worksDictForProjectId[p.id]
          )}
          passHref
        >
          <IconWrapper title={p.name} selected={p.id === props.currentProject?.id}>
            {getIconImageUrl(p.id) ? (
              <StyleIconImage>
                <IconImage src={getIconImageUrl(p.id)} />
              </StyleIconImage>
            ) : (
              <Icon>{p.name.slice(0, 2)}</Icon>
            )}
          </IconWrapper>
        </Link>
      ))}
      <PlusIcon onClick={addNewProject} />
      <CardModal open={isClickAddProject} onClose={closeModal}>
        <Message>Please enter a project name</Message>
        <Spacer axis="y" size={8} />
        <ProjectNameInput onComplete={closeModal} />
        <Spacer axis="y" size={8} />
        <Column>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
        </Column>
      </CardModal>
    </Container>
  )
}
