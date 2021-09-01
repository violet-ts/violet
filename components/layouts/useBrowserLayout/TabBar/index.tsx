import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ApiTreeProject, ApiTreeWork } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { alphaLevel, colors } from '~/utils/constants'
import { SelectableStyle } from '../SelectableStyle'

const Container = styled.div`
  display: flex;
  overflow: auto;
  user-select: none;
  background: ${colors.violet}${alphaLevel[1]};
`

const Tab = styled.div`
  padding: 12px;
  ${SelectableStyle};
`

export const TabBar = (props: {
  project: ApiTreeProject
  selectedWork?: ApiTreeWork
  onSelect: (work: ApiTreeWork) => void
}) => {
  const [tabWorks, setTabWorks] = useState<ApiTreeWork[]>([])
  const [openedWork, setOpenedWork] = useState<ApiTreeWork>()

  useEffect(() => {
    const workIds = props.project.desks.flatMap((d) => d.works.map((w) => w.id))
    const filteredTabs = tabWorks.filter((w) => workIds.includes(w.id))

    filteredTabs.length !== tabWorks.length && setTabWorks(filteredTabs)
  }, [props.project.desks, tabWorks])

  useEffect(() => {
    if (!props.selectedWork) return

    setOpenedWork(props.selectedWork)
    tabWorks.every((w) => w.id !== props.selectedWork?.id) &&
      setTabWorks([...tabWorks, props.selectedWork])
  }, [props.selectedWork, tabWorks])

  return (
    <Container>
      {tabWorks.map((w) => (
        <Tab key={w.id} selected={openedWork?.id === w.id} onClick={() => props.onSelect(w)}>
          {getWorkFullName(w)}
        </Tab>
      ))}
    </Container>
  )
}
