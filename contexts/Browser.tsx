import { createContext, useCallback, useState } from 'react'
import { BrowserApiWholeData, BrowserProject } from '~/server/types'

export const BrowserContext = createContext({
  projects: [] as BrowserProject[],
  apiWholeData: {} as BrowserApiWholeData,
  updateProjects: (() => {}) as (projects: BrowserProject[]) => void,
  updateProject: (() => {}) as (project: BrowserProject) => void,
  updateApiWholeData: (() => {}) as <T extends keyof BrowserApiWholeData>(
    key: T,
    data: BrowserApiWholeData[T]
  ) => void,
})

export const BrowserProvider: React.FC = ({ children }) => {
  const [projects, setProjects] = useState<BrowserProject[]>([])
  const [apiWholeData, setApiWholeData] = useState<BrowserApiWholeData>({
    projects: [],
    desksList: [],
    revisionsList: [],
    messagesList: [],
  })
  const updateProjects = useCallback((projects: BrowserProject[]) => {
    setProjects(projects)
  }, [])
  const updateProject = useCallback((project: BrowserProject) => {
    setProjects((ps) => ps.map((p) => (p.id === project.id ? project : p)))
  }, [])
  const updateApiWholeData = useCallback(
    <T extends keyof BrowserApiWholeData>(key: T, data: BrowserApiWholeData[T]) => {
      setApiWholeData((d) => ({ ...d, [key]: data }))
    },
    []
  )

  return (
    <BrowserContext.Provider
      value={{
        projects,
        apiWholeData,
        updateProjects,
        updateProject,
        updateApiWholeData,
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}
