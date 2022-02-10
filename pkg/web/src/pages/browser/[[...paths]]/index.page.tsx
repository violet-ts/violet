import { Fetching } from '@violet/web/src/components/organisms/Fetching'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserProject,
  BrowserWholeDict,
  CurrentDirsAndWork,
  DirsDictForProjectId,
  OperationData,
  WorksDictForProjectId,
} from '@violet/web/src/types/browser'
import { mainColumnHeight, toolBarWidth } from '@violet/web/src/utils/constants'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { MainColumn } from './components/MainColumn'
import { DirTab } from './components/MainColumn/DirTab'
import { ProjectBar } from './components/ProjectBar'
import { TabBar } from './components/Tab/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`
const ColumnsContainer = styled.div`
  display: flex;
  width: calc(100% - ${toolBarWidth}px);
`
const WorksWrap = styled.div`
  flex: 1;
  min-width: 0;
`
const WorksMain = styled.div`
  height: ${mainColumnHeight};
  overflow: hidden;
`

const Columns = (props: {
  currentDirsAndWork: CurrentDirsAndWork | undefined
  wholeDict: BrowserWholeDict
  operationData: OperationData
  currentProject: BrowserProject
  dirsDictForProjectId: DirsDictForProjectId
  worksDictForProjectId: WorksDictForProjectId
}) => {
  const revisions =
    props.currentDirsAndWork?.work &&
    props.wholeDict.revisionsForWorkId[props.currentDirsAndWork.work.id]

  return (
    <ColumnsContainer>
      <LeftColumn>
        <Explorer
          operationData={props.operationData}
          project={props.currentProject}
          dirs={props.wholeDict.dirsForProjectId[props.currentProject.id]}
          dirsDict={props.dirsDictForProjectId[props.currentProject.id]}
        />
      </LeftColumn>
      <WorksWrap>
        <DndProvider backend={HTML5Backend}>
          <TabBar
            project={props.currentProject}
            operationData={props.operationData}
            dirsDict={props.dirsDictForProjectId[props.currentProject.id]}
            worksDict={props.worksDictForProjectId[props.currentProject.id]}
          />
          {props.currentDirsAndWork?.work ? (
            revisions && revisions.length > 0 ? (
              <WorksMain>
                <MainColumn
                  projectId={props.currentProject.id}
                  workId={props.currentDirsAndWork.work.id}
                  revisions={revisions}
                />
              </WorksMain>
            ) : (
              <EmptyWork
                projectId={props.currentProject.id}
                workId={props.currentDirsAndWork.work.id}
              />
            )
          ) : (
            <DirTab
              project={props.currentProject}
              operationData={props.operationData}
              dirsDict={props.dirsDictForProjectId[props.currentProject.id]}
              worksDict={props.worksDictForProjectId[props.currentProject.id]}
            />
          )}
        </DndProvider>
      </WorksWrap>
    </ColumnsContainer>
  )
}

const BrowserPage = () => {
  const { operationDataDict, dirsDictForProjectId, worksDictForProjectId } = useBrowserContext()
  const pageData = usePage()

  if (!pageData.projects) return <Fetching error={pageData.error} />

  const { operationData, currentDirsAndWork, currentProject, projects, wholeDict } = pageData

  return (
    <Container>
      <ProjectBar
        {...{
          projects,
          currentProject,
          operationDataDict,
          dirsDictForProjectId,
          worksDictForProjectId,
        }}
      />
      {currentProject && operationData && (
        <Columns
          {...{
            currentDirsAndWork,
            wholeDict,
            operationData,
            currentProject,
            dirsDictForProjectId,
            worksDictForProjectId,
          }}
        />
      )}
    </Container>
  )
}

export default BrowserPage
