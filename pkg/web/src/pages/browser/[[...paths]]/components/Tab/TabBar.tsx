import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  DirsDict,
  OperationData,
  WorksDict,
} from '@violet/web/src/types/browser'
import type { DragItemType } from '@violet/web/src/types/dragTab'
import { tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors, scrollbarSize, tabHeight } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { MoveStyle } from '../MoveStyle'
import { WorkTab } from './WorkTab'

const Container = styled.div`
  display: flex;
  max-width: 100%;
  height: ${tabHeight};
  overflow: hidden;
  user-select: none;
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const EmptyArea = styled.div`
  flex: 1;
`

const DirTab = styled.div`
  padding: 8px;
`

const HoverItem = styled.div`
  height: calc(${tabHeight} - ${scrollbarSize});
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
  const [hoverItem, setHoverItem] = useState<'EmptyArea' | null>(null)

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
      {props.operationData.tabs[0]?.type === 'dir' && (
        <DirTab>
          <Link
            key={props.operationData.tabs[0].id}
            href={tabToHref(
              props.operationData.tabs[0],
              props.project,
              props.dirsDict,
              props.worksDict
            )}
            passHref
          >
            {props.dirsDict[props.operationData.tabs[0].id].name}
          </Link>
        </DirTab>
      )}
      <WorkTab
        dirsDict={props.dirsDict}
        worksDict={props.worksDict}
        operationData={props.operationData}
        project={props.project}
        onMove={onMove}
      />
      <EmptyArea ref={dropRef}>
        <HoverItem move={hoverItem === 'EmptyArea'} />
      </EmptyArea>
    </Container>
  )
}
