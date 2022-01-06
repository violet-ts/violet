import type { WorkId } from '@violet/lib/types/branded'
import { Cross } from '@violet/web/src/components/atoms/Cross'
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
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components'
import { ActiveStyle } from './ActiveStyle'
import { ExtIcon } from './ExtIcon'
import { Draggable } from './Tab/Dragable'

const Container = styled.div`
  display: flex;
  height: 41px;
  user-select: none;
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const TabItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 8px;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
  ${ActiveStyle};
`

const CrossButton = styled.button`
  width: 18px;
  height: 18px;
  cursor: pointer;
  border: none;
  opacity: 0;

  :hover {
    background-color: ${colors.transparent};
    outline: none;
    opacity: 1;
  }
`

export const TabBar = (props: {
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()

  const onClickCrossWorkTab = async (event: React.MouseEvent, workId: WorkId) => {
    event.preventDefault()
    const remainTabs = props.operationData.tabs.filter((t) => t.id !== workId)
    updateOperationData(props.project.id, { ...props.operationData, tabs: remainTabs })
    if (props.operationData.activeTab?.id === workId) {
      await push(tabToHref(remainTabs.slice(-1)[0], props.project, props.dirsDict, props.worksDict))
    }
  }

  const onMove = useCallback(
    (dragIndex: number, targetIndex: number) => {
      const swapTab = props.operationData.tabs[dragIndex]
      const otherTabs = props.operationData.tabs.filter((_, index) => index !== dragIndex)
      updateOperationData(props.project.id, {
        ...props.operationData,
        tabs: otherTabs.splice(targetIndex, 0, swapTab),
      })
    },
    [props.project, props.operationData, updateOperationData]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        {props.operationData.tabs.map((t) => (
          <Link
            key={t.id}
            href={tabToHref(t, props.project, props.dirsDict, props.worksDict)}
            passHref
          >
            <TabItem active={props.operationData.activeTab?.id === t.id}>
              {t.type === 'work' ? (
                <Draggable onMove={() => onMove} tabs={props.operationData.tabs} workId={t.id}>
                  <ExtIcon name={getWorkFullName(props.worksDict[t.id])} />
                  <Spacer axis="x" size={6} />
                  <span>{getWorkFullName(props.worksDict[t.id])}</span>
                  <Spacer axis="x" size={6} />
                  <CrossButton onClick={(e) => onClickCrossWorkTab(e, t.id)}>
                    <Cross size={12} />
                  </CrossButton>
                </Draggable>
              ) : (
                <span>{props.dirsDict[t.id].name}</span>
              )}
            </TabItem>
          </Link>
        ))}
      </Container>
    </DndProvider>
  )
}
