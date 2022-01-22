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
import { mainColumnHeight, projectBarWidth } from '@violet/web/src/utils/constants'
import { useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components'
import { EmptyWork } from './components/EmptyWork'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { MainColumn } from './components/MainColumn'
import { ProjectBar } from './components/ProjectBar'
import { TabBar } from './components/Tab/TabBar'
import { usePage } from './usePage'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
`
const WorksView = styled.div.attrs<{ width: number }>((props) => ({
  style: { width: props.width },
}))<{
  width: number
}>`
  flex: 1;
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
  const [leftColumnWidth, setLeftColumnWidth] = useState(300)
  const revisions =
    props.currentDirsAndWork?.work &&
    props.wholeDict.revisionsForWorkId[props.currentDirsAndWork.work.id]

  const worksViewWidth = useMemo(
    () => window.innerWidth - projectBarWidth - leftColumnWidth,
    [leftColumnWidth]
  )

  return (
    <>
      <LeftColumn leftColumnWidth={leftColumnWidth} setLeftColumnWidth={setLeftColumnWidth}>
        <Explorer
          operationData={props.operationData}
          project={props.currentProject}
          dirs={props.wholeDict.dirsForProjectId[props.currentProject.id]}
          dirsDict={props.dirsDictForProjectId[props.currentProject.id]}
        />
      </LeftColumn>
      <WorksView width={worksViewWidth}>
        <DndProvider backend={HTML5Backend}>
          <TabBar
            project={props.currentProject}
            operationData={props.operationData}
            dirsDict={props.dirsDictForProjectId[props.currentProject.id]}
            worksDict={props.worksDictForProjectId[props.currentProject.id]}
            leftColumnWidth={leftColumnWidth}
          />
        </DndProvider>
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
          <div>Choose work</div>
        )}
      </WorksView>
    </>
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
