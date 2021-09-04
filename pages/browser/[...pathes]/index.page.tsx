import styled from 'styled-components'
import { Fetching } from '~/components/organisms/Fetching'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { ProjectBar } from './components/ProjectBar'
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

const ViewerColumn = styled.div`
  flex: 1;
  height: 100%;
`

const StreamBarColumn = styled.div`
  width: 300px;
  height: 100%;
`

const ProjectPage = () => {
  const { error, apiWholeData, projectApiData, project, updateProject } = usePage()

  if (!projectApiData) return <Fetching error={error} />

  return (
    <Container>
      <ProjectBar apiWholeData={apiWholeData} projectId={projectApiData.projectId} />
      <LeftColumn>
        <Explorer projectApiData={projectApiData} project={project} updateProject={updateProject} />
      </LeftColumn>
      <MainColumn>
        <TabBar project={project} updateProject={updateProject} />
        <MainContent>
          <ViewerColumn></ViewerColumn>
          <StreamBarColumn>
            <StreamBar />
          </StreamBarColumn>
        </MainContent>
      </MainColumn>
    </Container>
  )
}

export default ProjectPage
