import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import type {
  BrowserProject,
  DirsDict,
  OperationData,
  WorksDict,
} from '@violet/web/src/types/browser'
import { getWorkFullName, tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import styled from 'styled-components'
import { ActiveStyle } from './ActiveStyle'
import { ExtIcon } from './ExtIcon'

const Container = styled.div`
  display: flex;
  height: 41px;
  user-select: none;
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const TabItem = styled.a`
  padding: 12px;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
  ${ActiveStyle};
`

export const TabBar = (props: {
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}) => {
  return (
    <Container>
      {props.operationData.tabs.map((t) => (
        <Link
          key={t.id}
          href={tabToHref(t, props.project, props.dirsDict, props.worksDict)}
          passHref
        >
          <TabItem active={props.operationData.activeTab?.id === t.id}>
            {t.type === 'work' ? (
              <>
                <ExtIcon name={getWorkFullName(props.worksDict[t.id])} />
                <Spacer axis="x" size={6} />
                <span>{getWorkFullName(props.worksDict[t.id])}</span>
              </>
            ) : (
              <span>{props.dirsDict[t.id].name}</span>
            )}
          </TabItem>
        </Link>
      ))}
    </Container>
  )
}
