import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { useApi } from '~/hooks'
import type { ApiTree, ProjectId } from '~/server/types'
import { Explorer } from './Explorer'
import { LeftColumn } from './LeftColumn'
import { WorkTabBar } from './WorkTabBar'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
`

const MainColumn = styled.div`
  flex: 1;
  height: 100%;
`

const BrowserLayout = ({ data, children }: PropsWithChildren<{ data: ApiTree }>) => {
  return (
    <Container>
      <LeftColumn>
        <Explorer tree={data} />
      </LeftColumn>
      <MainColumn>
        <WorkTabBar />
        <div>{children}</div>
      </MainColumn>
    </Container>
  )
}

export const useBrowserLayout = (params: { projectId: ProjectId }) => {
  const { api, useAspidaSWR } = useApi()
  const { data, error, mutate } = useAspidaSWR(api.tree._projectId(params.projectId))

  return { BrowserLayout, layoutData: data, layoutError: error, mutateLayout: mutate }
}
