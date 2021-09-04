import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import type { BrowserProject, BrowserWork, OpenedFullPathDict } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { alphaLevel, colors } from '~/utils/constants'
import { ExtIcon } from './ExtIcon'
import { SelectableStyle } from './SelectableStyle'

const Container = styled.div`
  display: flex;
  height: 41px;
  overflow: auto;
  user-select: none;
  background: ${colors.violet}${alphaLevel[1]};
  border-bottom: 1px solid ${colors.violet}${alphaLevel[3]};
`

const Tab = styled.div`
  padding: 12px;
  ${SelectableStyle};
`

export const TabBar = ({
  project,
  updateProject,
}: {
  project: BrowserProject
  updateProject: (project: BrowserProject) => void
}) => {
  const onSelect = (tab: BrowserWork) => {
    const openedFullPathDict = Object.keys(project.openedFullPathDict).reduce<OpenedFullPathDict>(
      (p, k) => ({ ...p, [k]: tab.fullPath.startsWith(k) || project.openedFullPathDict[k] }),
      {}
    )

    updateProject({
      ...project,
      openedTab: tab,
      selectedFullPath: tab.fullPath,
      openedFullPathDict:
        JSON.stringify(openedFullPathDict) === JSON.stringify(project.openedFullPathDict)
          ? project.openedFullPathDict
          : openedFullPathDict,
    })
  }

  return (
    <Container>
      {project.tabs.map((t) => (
        <Tab key={t.id} selected={project.openedTab?.id === t.id} onClick={() => onSelect(t)}>
          <ExtIcon name={getWorkFullName(t)} />
          <Spacer axis="x" size={6} />
          <span>{getWorkFullName(t)}</span>
        </Tab>
      ))}
    </Container>
  )
}
