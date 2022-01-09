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
import type { DragItemType } from '@violet/web/src/types/dragTab'
import { getWorkFullName, tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { ExtIcon } from '../ExtIcon'
import { ActiveStyle } from '../Styles/ActiveStyle'
import { MoveStyle } from '../Styles/MoveStyle'
import { Draggable } from './Dragable'

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

const EmptyArea = styled.div`
  flex: 1;
`

const HoverItem = styled.div`
  height: 100%;
  ${MoveStyle};
`

const ItemType = 'work' as const

export const TabBar = (props: {
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()
  const [hoverItem, setHoverItem] = useState<WorkId | 'EmptyArea' | null>(null)

  const onClickCrossWorkTab = async (event: React.MouseEvent, workId: WorkId) => {
    event.preventDefault()
    const remainTabs = props.operationData.tabs.filter((t) => t.id !== workId)
    updateOperationData(props.project.id, { ...props.operationData, tabs: remainTabs })
    if (props.operationData.activeTab?.id === workId) {
      await push(tabToHref(remainTabs.slice(-1)[0], props.project, props.dirsDict, props.worksDict))
    }
  }
  const changeStyleOfHoverItem = (hoverItem: WorkId) => {
    setHoverItem(hoverItem)
  }
  const onMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragTab = props.operationData.tabs[dragIndex]
      const swapTabs = props.operationData.tabs.filter((_, index) => index !== dragIndex)
      swapTabs.splice(hoverIndex, 0, dragTab)

      updateOperationData(props.project.id, {
        ...props.operationData,
        tabs: swapTabs,
      })
      if (props.operationData.activeTab?.id !== dragTab.id) {
        void push(tabToHref(dragTab, props.project, props.dirsDict, props.worksDict))
      }
      setHoverItem(null)
    },
    [props.operationData, props.project, props.dirsDict, props.worksDict, updateOperationData, push]
  )
  const [, dropRef] = useDrop({
    accept: ItemType,
    hover() {
      setHoverItem('EmptyArea')
    },
    drop(item: DragItemType) {
      onMove(item.index, props.operationData.tabs.length - 1)
      setHoverItem(null)
    },
  })

  return (
    <Container>
      {props.operationData.tabs.map((t, index) => (
        <Link
          key={t.id}
          href={tabToHref(t, props.project, props.dirsDict, props.worksDict)}
          passHref
        >
          <HoverItem move={hoverItem === t.id}>
            <TabItem active={props.operationData.activeTab?.id === t.id}>
              {t.type === 'work' ? (
                <>
                  <Draggable
                    onMove={onMove}
                    changeStyleOfHoverItem={changeStyleOfHoverItem}
                    workId={t.id}
                    itemType={t.type}
                    index={index}
                  >
                    <ExtIcon name={getWorkFullName(props.worksDict[t.id])} />
                    <Spacer axis="x" size={6} />
                    <span>{getWorkFullName(props.worksDict[t.id])}</span>
                    <Spacer axis="x" size={6} />
                    <CrossButton onClick={(e) => onClickCrossWorkTab(e, t.id)}>
                      <Cross size={12} />
                    </CrossButton>
                  </Draggable>
                </>
              ) : (
                <span>{props.dirsDict[t.id].name}</span>
              )}
            </TabItem>
          </HoverItem>
        </Link>
      ))}
      <EmptyArea ref={dropRef}>
        <HoverItem move={hoverItem === 'EmptyArea'} />
      </EmptyArea>
    </Container>
  )
}
