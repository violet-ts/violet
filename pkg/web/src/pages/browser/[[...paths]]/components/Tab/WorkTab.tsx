import type { ApiProject } from '@violet/lib/types/api'
import type { WorkId } from '@violet/lib/types/branded'
import { Cross } from '@violet/web/src/components/atoms/Cross'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { DirsDict, OperationData, WorksDict } from '@violet/web/src/types/browser'
import { getWorkFullName, tabToHref } from '@violet/web/src/utils'
import { alphaLevel, colors, tabHeight } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { ExtIcon } from '../ExtIcon'
import { ActiveStyle } from '../Styles/ActiveStyle'
import { DisplayScrollBarStyle, FocusByTabKeyStyle } from '../Styles/PartsStyles'
import { Draggable } from './Dragable'
import { HoverItem } from './TabBar'

const Container = styled.div`
  display: flex;
  width: 100%;
  height: ${tabHeight};
  overflow-x: scroll;
  overflow-y: hidden;
  ${DisplayScrollBarStyle}
`

const TabItem = styled.button`
  ${FocusByTabKeyStyle}
  display: flex;
  gap: 4px;
  align-items: center;
  height: ${tabHeight};
  white-space: nowrap;
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

type ComponentPoprs = PropsWithChildren<{
  project: ApiProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
  hoverItem: WorkId | 'EmptyArea' | null
  displayedScroll: boolean
  onMove: (dragIndex: number, hoverIndex: number) => void
  setHoverItem: (value: React.SetStateAction<WorkId | 'EmptyArea' | null>) => void
}>

export const WorkTabs = ({
  children,
  project,
  operationData,
  dirsDict,
  worksDict,
  hoverItem,
  displayedScroll,
  onMove,
  setHoverItem,
}: ComponentPoprs) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()

  const onClickCrossWorkTab = async (event: React.MouseEvent, workId: WorkId) => {
    event.preventDefault()
    const remainTabs = operationData.tabs.filter((t) => t.id !== workId)
    updateOperationData(project.id, { ...operationData, tabs: remainTabs })
    if (operationData.activeTab?.id === workId) {
      await push(tabToHref(remainTabs.slice(-1)[0], project, dirsDict, worksDict))
    }
  }

  return (
    <Container displayedScroll={displayedScroll}>
      {children}
      {operationData.tabs.map(
        (t, index) =>
          t.type === 'work' && (
            <Link key={t.id} href={tabToHref(t, project, dirsDict, worksDict)} passHref>
              <HoverItem move={hoverItem === t.id}>
                <Draggable onMove={onMove} setHoverItem={setHoverItem} workId={t.id} index={index}>
                  <TabItem active={operationData.activeTab?.id === t.id}>
                    <Spacer axis="x" size={4} />
                    <ExtIcon name={getWorkFullName(worksDict[t.id])} />
                    <span>{getWorkFullName(worksDict[t.id])}</span>
                    <CrossButton onClick={(e) => onClickCrossWorkTab(e, t.id)} tabIndex={-1}>
                      <Cross size={12} />
                    </CrossButton>
                  </TabItem>
                </Draggable>
              </HoverItem>
            </Link>
          )
      )}
    </Container>
  )
}
