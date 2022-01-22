import type { WorkId } from '@violet/lib/types/branded'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  DirsDict,
  OperationData,
  WorksDict,
} from '@violet/web/src/types/browser'
import type { DragItemType } from '@violet/web/src/types/dragTab'
import { tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors, tabHeight } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useCallback, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import styled from 'styled-components'
import { MoveStyle } from '../Styles/MoveStyle'
import { FocusByTabKeyStyle } from '../Styles/PartsStyles'
import { itemType } from './Dragable'
import { WorkTabs } from './WorkTab'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: ${tabHeight};
  overflow: hidden;
  user-select: none;
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const EmptyArea = styled.div`
  flex: 1;
`

const DirTab = styled.button`
  ${FocusByTabKeyStyle}
  padding: 4px;
  white-space: nowrap;
  border-right: 1px solid ${colors.violet}${alphaLevel[2]};
`

export const HoverItem = styled.div`
  height: ${tabHeight};
  ${MoveStyle};
`

export const TabBar = (props: {
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()
  const tabRef = useRef<HTMLInputElement>(null)
  const [hoverItem, setHoverItem] = useState<WorkId | 'EmptyArea' | null>(null)

  const onMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedTab = props.operationData.tabs[dragIndex]
      const swappedTabs = props.operationData.tabs.filter((_, index) => index !== dragIndex)
      swappedTabs.splice(hoverIndex, 0, draggedTab)

      updateOperationData(props.project.id, {
        ...props.operationData,
        tabs: swappedTabs,
      })
      if (props.operationData.activeTab?.id !== draggedTab.id) {
        void push(tabToHref(draggedTab, props.project, props.dirsDict, props.worksDict))
      }
      setHoverItem(null)
    },
    [props.operationData, props.project, props.dirsDict, props.worksDict, updateOperationData, push]
  )
  const [, dropRef] = useDrop({
    accept: itemType,
    hover() {
      setHoverItem('EmptyArea')
    },
    drop(item: DragItemType) {
      onMove(item.index, props.operationData.tabs.length - 1)
      setHoverItem(null)
    },
  })

  return (
    <Container ref={tabRef}>
      {props.operationData.tabs[0]?.type === 'dir' && (
        <Link
          href={tabToHref(
            props.operationData.tabs[0],
            props.project,
            props.dirsDict,
            props.worksDict
          )}
          passHref
        >
          <DirTab>{props.dirsDict[props.operationData.tabs[0].id].name}</DirTab>
        </Link>
      )}
      <WorkTabs
        project={props.project}
        dirsDict={props.dirsDict}
        worksDict={props.worksDict}
        operationData={props.operationData}
        hoverItem={hoverItem}
        onMove={onMove}
        setHoverItem={setHoverItem}
      />
      <EmptyArea ref={dropRef}>
        <HoverItem move={hoverItem === 'EmptyArea'} />
      </EmptyArea>
    </Container>
  )
}
