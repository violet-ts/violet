import styled from 'styled-components'
import { Fetching } from '~/components/organisms/Fetching'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { ProjectBar } from './components/ProjectBar'
import { Revision } from './components/Revision'
import { StreamBar } from './components/StreamBar'
import { TabBar } from './components/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
`

const MainColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`

const MainContent = styled.div`
  display: flex;
  height: 100%;
`

const RevisionColumn = styled.div`
  flex: 1;
  height: 100%;
`

const StreamBarColumn = styled.div`
  width: 300px;
  height: 100%;
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
      <MainColumn>
        <TabBar project={currentProject} projectApiData={projectApiData} />
        <MainContent>
          {projectApiData.revisions ? (
            projectApiData.revisions.length ? (
              <>
                <RevisionColumn>
                  <Revision />
                </RevisionColumn>
                <StreamBarColumn>
                  <StreamBar project={currentProject} projectApiData={projectApiData} />
                </StreamBarColumn>
              </>
            ) : (
              <EmptyWork />
            )
          ) : (
            <div>Choose work</div>
          )}
        </MainContent>
      </MainColumn>
    </Container>
  )
}

export default ProjectPage
