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
import { alphaLevel, colors, scrollbarSize, tabHeight } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'
import { ActiveStyle } from '../ActiveStyle'
import { ExtIcon } from '../ExtIcon'
import { MoveStyle } from '../MoveStyle'
import { Draggable } from './Dragable'

const Container = styled.div`
  display: flex;
  height: ${tabHeight};
  overflow-x: scroll;
  overflow-y: hidden;

  ::-webkit-scrollbar {
    height: ${scrollbarSize};
    background-color: ${colors.transparent};
  }

  :hover {
    ::-webkit-scrollbar {
      height: ${scrollbarSize};
      background-color: ${colors.violet}${alphaLevel[2]};
    }
  }
`

const TabItem = styled.div`
  display: flex;
  height: calc(100% - ${scrollbarSize});
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

const HoverItem = styled.div`
  height: calc(${tabHeight} - ${scrollbarSize});
  ${MoveStyle};
`

interface Props {
  children?: React.ReactNode
  project: BrowserProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export const WorkTab = ({
  children,
  project,
  operationData,
  dirsDict,
  worksDict,
  onMove,
}: Props) => {
  const { updateOperationData } = useBrowserContext()
  const { push } = useRouter()
  const [hoverItem, setHoverItem] = useState<WorkId | null>(null)

  const onClickCrossWorkTab = async (event: React.MouseEvent, workId: WorkId) => {
    event.preventDefault()
    const remainTabs = operationData.tabs.filter((t) => t.id !== workId)
    updateOperationData(project.id, { ...operationData, tabs: remainTabs })
    if (operationData.activeTab?.id === workId) {
      await push(tabToHref(remainTabs.slice(-1)[0], project, dirsDict, worksDict))
    }
  }
  const changeStyleOfHoverItem = (hoverItem: WorkId) => {
    setHoverItem(hoverItem)
  }

  return (
    <Container>
      {children}
      {operationData.tabs.slice(1).map((t, index) => (
        <Link key={t.id} href={tabToHref(t, project, dirsDict, worksDict)} passHref>
          <HoverItem move={hoverItem === t.id}>
            <TabItem active={operationData.activeTab?.id === t.id}>
              {t.type === 'work' && (
                <Draggable
                  onMove={onMove}
                  changeStyleOfHoverItem={changeStyleOfHoverItem}
                  workId={t.id}
                  itemType={t.type}
                  index={index}
                >
                  <ExtIcon name={getWorkFullName(worksDict[t.id])} />
                  <Spacer axis="x" size={6} />
                  <span>{getWorkFullName(worksDict[t.id])}</span>
                  <Spacer axis="x" size={6} />
                  <CrossButton onClick={(e) => onClickCrossWorkTab(e, t.id)}>
                    <Cross size={12} />
                  </CrossButton>
                </Draggable>
              )}
            </TabItem>
          </HoverItem>
        </Link>
      ))}
    </Container>
  )
}
