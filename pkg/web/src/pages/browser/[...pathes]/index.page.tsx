import { Fetching } from '@violet/web/src/components/organisms/Fetching'
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

  if (!projectApiData || !currentProject) return <Fetching error={error} />

  return (
    <Container>
      <ProjectBar projects={projects} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={currentProject} />
      </LeftColumn>
      <WorksView>
        {currentProject.openedTabId ? (
          projectApiData.revisions?.length ? (
            <>
              <WorksHeader>
                <TabBar project={currentProject} projectApiData={projectApiData} />
              </WorksHeader>
              <WroksMain>
                <MainColumn
                  projectId={currentProject.id}
                  workId={currentProject.openedTabId}
                  revisions={projectApiData.revisions}
                  messages={projectApiData.messages}
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
