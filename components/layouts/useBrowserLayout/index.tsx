import useAspidaSWR from '@aspida/swr'
import { PropsWithChildren, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useApi } from '~/hooks'
import type { ApiProjectSummary, ApiTreeProject, ApiTreeWork, ProjectId } from '~/server/types'
import { Explorer } from './Explorer'
import { LeftColumn } from './LeftColumn'
import { ProjectBar } from './ProjectBar'
import { TabBar } from './TabBar'

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

type Props = {
  project: ApiTreeProject
  summaries: ApiProjectSummary[]
}

const BrowserLayout = ({ project, summaries, children }: PropsWithChildren<Props>) => {
  const [selecteWork, setSelectedWork] = useState<ApiTreeWork>()

  return (
    <Container>
      <ProjectBar summaries={summaries} projectId={project.id} />
      <LeftColumn>
        <Explorer project={project} selectedWork={selecteWork} onSelect={setSelectedWork} />
      </LeftColumn>
      <MainColumn>
        <TabBar project={project} selectedWork={selecteWork} onSelect={setSelectedWork} />
        <div>{children}</div>
      </MainColumn>
    </Container>
  )
}

export const useBrowserLayout = (params: { projectId: ProjectId }) => {
  const { api } = useApi()
  const projectRes = useAspidaSWR(api.browser.tree._projectId(params.projectId))
  const summariesRes = useAspidaSWR(api.browser.projects)
  const props: Props | undefined = useMemo(
    () =>
      projectRes.data &&
      summariesRes.data && { project: projectRes.data, summaries: summariesRes.data },
    [projectRes.data, summariesRes.data]
  )

  return {
    BrowserLayout,
    layoutProps: props,
    layoutError: projectRes.error ?? summariesRes.error,
    layoutMutations: {
      tree: projectRes.mutate,
      summaries: summariesRes.mutate,
    },
  }
}
