import type { ProjectId } from '@violet/lib/types/branded'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type {
  BrowserDir,
  BrowserProject,
  BrowserWholeDict,
  DirsDict,
  DirsDictForProjectId,
  OperationData,
  WorksDict,
  WorksDictForProjectId,
} from '../types/browser'

type UpdateWholeDict = <T extends keyof BrowserWholeDict>(key: T, dict: BrowserWholeDict[T]) => void

const BrowserContext = createContext({
  operationDataDict: {} as Record<ProjectId, OperationData>,
  projects: [] as BrowserProject[],
  wholeDict: {} as BrowserWholeDict,
  dirsDictForProjectId: {} as DirsDictForProjectId,
  worksDictForProjectId: {} as WorksDictForProjectId,
  updateOperationData: (() => {}) as (projectId: ProjectId, data: OperationData) => void,
  updateProjects: (() => {}) as (projects: BrowserProject[]) => void,
  updateProject: (() => {}) as (project: BrowserProject) => void,
  updateWholeDict: (() => {}) as UpdateWholeDict,
})

export const useBrowserContext = () => useContext(BrowserContext)

const reduceToWorksDict = (dict: WorksDict, d: BrowserDir): WorksDict => ({
  ...dict,
  ...d.works.reduce((wDict, w): WorksDict => ({ ...wDict, [w.id]: w }), {}),
})

export const BrowserProvider: React.FC = ({ children }) => {
  const [operationDataDict, setOperationDataDict] = useState<Record<ProjectId, OperationData>>({})
  const [projects, setProjects] = useState<BrowserProject[]>([])
  const [wholeDict, setWholeDict] = useState<BrowserWholeDict>({
    dirsForProjectId: {},
    revisionsForWorkId: {},
    messagesForRevisionId: {},
  })
  const dirsDictForProjectId = useMemo(
    () =>
      projects.reduce<DirsDictForProjectId>(
        (dirsDict, project) => ({
          ...dirsDict,
          [project.id]: wholeDict.dirsForProjectId[project.id].reduce<DirsDict>(
            (dict, d) => ({ ...dict, [d.id]: d }),
            {}
          ),
        }),
        {}
      ),
    [projects, wholeDict.dirsForProjectId]
  )
  const worksDictForProjectId = useMemo(
    () =>
      projects.reduce(
        (worksDict, project): WorksDictForProjectId => ({
          ...worksDict,
          [project.id]: wholeDict.dirsForProjectId[project.id].reduce(reduceToWorksDict, {}),
        }),
        {}
      ),
    [projects, wholeDict.dirsForProjectId]
  )
  const updateOperationData = useCallback((projectId: ProjectId, data: OperationData) => {
    setOperationDataDict((d) => ({ ...d, [projectId]: data }))
  }, [])
  const updateWholeDict = useCallback<UpdateWholeDict>(
    (key, dict) => setWholeDict((d) => ({ ...d, [key]: { ...d[key], ...dict } })),
    []
  )
  const updateProjects = useCallback(
    (projects: BrowserProject[]) => {
      setProjects(projects)
      projects.forEach((p) => {
        updateOperationData(p.id, { tabs: [], activeTab: undefined, openedDirDict: {} })
        updateWholeDict('dirsForProjectId', { [p.id]: [] })
      })
    },
    [updateOperationData, updateWholeDict]
  )
  const updateProject = useCallback(
    (project: BrowserProject) => {
      if (projects.some((p) => p.id === project.id)) {
        setProjects(projects.map((p) => (p.id === project.id ? project : p)))
      } else {
        setProjects([...projects, project])
        updateOperationData(project.id, { tabs: [], activeTab: undefined, openedDirDict: {} })
        updateWholeDict('dirsForProjectId', { [project.id]: [] })
      }
    },
    [projects, updateOperationData, updateWholeDict]
  )

  return (
    <BrowserContext.Provider
      value={{
        operationDataDict,
        projects,
        wholeDict,
        dirsDictForProjectId,
        worksDictForProjectId,
        updateOperationData,
        updateProjects,
        updateProject,
        updateWholeDict,
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}
