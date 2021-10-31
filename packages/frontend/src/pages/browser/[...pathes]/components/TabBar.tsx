import Link from 'next/link'
import styled from 'styled-components'
import { Spacer } from '@violet/frontend/src/components/atoms/Spacer'
import type { BrowserProject, ProjectApiData } from '@violet/api/src/types'
import { getWorkFullName } from '@violet/frontend/src/utils'
import { pagesPath } from '@violet/frontend/src/utils/$path'
import { alphaLevel, colors } from '@violet/frontend/src/utils/constants'
import { ExtIcon } from './ExtIcon'
import { SelectableStyle } from './SelectableStyle'

const Container = styled.div`
  display: flex;
  height: 41px;
  overflow: auto;
  user-select: none;
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const Tab = styled.a`
  display: block;
  padding: 12px;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
  ${SelectableStyle};
`

export const TabBar = ({
  project,
  projectApiData,
}: {
  project: BrowserProject
  projectApiData: ProjectApiData
}) => {
  return (
    <Container>
      {project.tabs.map((t) => (
        <Link
          key={t.id}
          href={pagesPath.browser
            ._pathes([
              project.id,
              projectApiData.desks.find((d) => d.works.some((w) => w.id === t.id))?.name ?? '',
              ...t.path.split('/').slice(1),
              getWorkFullName(t),
            ])
            .$url()}
          passHref
        >
          <Tab selected={project.openedTabId === t.id}>
            <ExtIcon name={getWorkFullName(t)} />
            <Spacer axis="x" size={6} />
            <span>{getWorkFullName(t)}</span>
          </Tab>
        </Link>
      ))}
    </Container>
  )
}
