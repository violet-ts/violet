import Link from 'next/link'
import styled from 'styled-components'
import type { BrowserProject, ProjectId } from '~/server/types'
import { pagesPath } from '~/utils/$path'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  height: 100%;
  padding: 6px;
  user-select: none;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
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

export const ProjectBar = (props: { projects: BrowserProject[]; projectId: ProjectId }) => {
  return (
    <Container>
      {props.projects.map((p) => (
        <Link
          key={p.id}
          href={pagesPath.browser._pathes(p.selectedFullPath.split('/')).$url()}
          passHref
        >
          <IconWrapper title={p.name} selected={p.id === props.projectId}>
            <Icon>{p.name.slice(0, 2)}</Icon>
          </IconWrapper>
        </Link>
      ))}
    </Container>
  )
}
