import Link from 'next/link'
import styled from 'styled-components'
import type { ApiProjectSummary, ProjectId } from '~/server/types'
import { pagesPath } from '~/utils/$path'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  height: 100%;
  padding: 6px;
  user-select: none;
  background: ${colors.violet}${alphaLevel[1]};
  border-right: 1px solid ${colors.violet}${alphaLevel[3]};
`

const alpha = (selected: boolean) => (selected ? alphaLevel[6] : alphaLevel[3])

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

export const ProjectBar = (props: { summaries: ApiProjectSummary[]; projectId: ProjectId }) => {
  return (
    <Container>
      {props.summaries.map((s) => (
        <Link key={s.id} href={pagesPath.browser._projectId(s.id).$url()} passHref>
          <IconWrapper title={s.name} selected={s.id === props.projectId}>
            <Icon>{s.name.slice(0, 2)}</Icon>
          </IconWrapper>
        </Link>
      ))}
    </Container>
  )
}
