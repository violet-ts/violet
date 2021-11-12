import type { BrowserRevision } from '@violet/api/types'
import { Fetching } from '@violet/web/src/components/organisms/Fetching'
import { useMemo } from 'react'
import styled from 'styled-components'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { MainColumn } from './components/MainColumn'
import { ProjectBar } from './components/ProjectBar'
import { TabBar } from './components/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
`
const WorksView = styled.div`
  width: 100%;
`
const WorksHeader = styled.div`
  width: 100%;
`
const WroksMain = styled.div`
  height: 100vh;
  overflow-y: scroll;
`

const ProjectPage = () => {
  const { error, projectApiData, projects, currentProject } = usePage()

  const browserRevisionData = useMemo((): BrowserRevision[] | void => {
    if (!projectApiData?.revisions) return
    if (!projectApiData?.messages) return
    const revisions: BrowserRevision[] = projectApiData.revisions.map((p) => ({
      id: p.id,
      editions: [],
      messages: projectApiData.messages
        ? projectApiData.messages.filter((message) => p.messageIds?.includes(message.id))
        : [],
    }))
    return revisions
  }, [projectApiData])

  if (!projectApiData || !currentProject) return <Fetching error={error} />

  return (
    <Container>
      <ProjectBar projects={projects} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={currentProject} />
      </LeftColumn>
      <WorksView>
        {currentProject.openedTabId ? (
          browserRevisionData ? (
            <>
              <WorksHeader>
                <TabBar project={currentProject} projectApiData={projectApiData} />
              </WorksHeader>
              <WroksMain>
                <MainColumn
                  projectId={currentProject.id}
                  workId={currentProject.openedTabId}
                  revisions={browserRevisionData}
                />
              </WroksMain>
            </>
          ) : (
            <>
              <TabBar project={currentProject} projectApiData={projectApiData} />
              <EmptyWork projectId={currentProject.id} workId={currentProject.openedTabId} />
            </>
          )
        ) : (
          <div>Choose work</div>
        )}
      </WorksView>
    </Container>
  )
}

export default ProjectPage
