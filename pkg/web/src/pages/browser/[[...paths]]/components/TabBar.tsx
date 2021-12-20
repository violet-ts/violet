import type { DirId } from '@violet/lib/types/branded'
import { StyledCross } from '@violet/web/src/components/atoms/Cross'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  DirsDict,
  OperationData,
  WorksDict,
} from '@violet/web/src/types/browser'
import { getWorkFullName, tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import React from 'react'
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

const CrossButton = styled.button`
  width: 18px;
  height: 18px;
  cursor: pointer;
  opacity: 0;
  :hover {
    border: none;
    opacity: 1;
  }
`

export const TabBar = (props: {
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}) => {
  const { wholeDict, updateWholeDict } = useBrowserContext()

  const onClickCrossDirTab = (dirId: DirId) => {
    updateWholeDict('dirsForProjectId', {
      [props.project.id]: wholeDict.dirsForProjectId[props.project.id].filter(
        (d) => d.id !== dirId
      ),
    })
  }

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
                <Spacer axis="x" size={6} />
                <CrossButton>
                  <StyledCross size={12} />
                </CrossButton>
              </>
            ) : (
              <>
                <span>{props.dirsDict[t.id].name}</span>
                <Spacer axis="x" size={6} />
                <CrossButton onClick={() => onClickCrossDirTab(t.id)}>
                  <StyledCross size={12} />
                </CrossButton>
              </>
            )}
          </TabItem>
        </Link>
      ))}
    </Container>
  )
}
