import type { WorkId } from '@violet/lib/types/branded'
import { StyledCross } from '@violet/web/src/components/atoms/Cross'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  DirsDict,
  OperationData,
  WorksDict,
} from '@violet/web/src/types/browser'
import { getWorkFullName, pathForChangeTab, tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
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
  const { operationDataDict, updateOperationData } = useBrowserContext()
  const { tabs, activeTab, openedDirDict } = operationDataDict[props.project.id]
  const { asPath, push } = useRouter()

  const onClickCrossWorkTab = async (
    element: React.MouseEvent<HTMLButtonElement>,
    workId: WorkId
  ) => {
    element.preventDefault()
    console.log('click!!!!!')
    const remainTabs = tabs.filter((t) => t.id !== workId)

    const changeTab = remainTabs ? remainTabs.slice(-1)[0] : undefined
    const path = pathForChangeTab(changeTab, props.project, props.dirsDict, props.worksDict)
    console.log('remainsTabs->', remainTabs, 'changeTab->', changeTab)
    await push(path).then(() => {
      updateOperationData(props.project.id, {
        tabs: remainTabs,
        activeTab: changeTab,
        openedDirDict,
      })
      console.log('Tabs->', tabs)
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
                <CrossButton
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => onClickCrossWorkTab(e, t.id)}
                >
                  <StyledCross size={12} />
                </CrossButton>
              </>
            ) : (
              <>
                <span>{props.dirsDict[t.id].name}</span>
              </>
            )}
          </TabItem>
        </Link>
      ))}
    </Container>
  )
}
