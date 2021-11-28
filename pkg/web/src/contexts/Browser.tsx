import type { ApiProject } from '@violet/lib/types/api'
import { createContext, useCallback, useState } from 'react'
import type { BrowserApiWholeDict, BrowserProject } from '../types/browser'

export const BrowserContext = createContext({
  projects: [] as BrowserProject[],
  apiProjects: [] as ApiProject[],
  apiWholeDict: {} as BrowserApiWholeDict,
  updateProjects: (() => {}) as (projects: BrowserProject[]) => void,
  updateProject: (() => {}) as (project: BrowserProject) => void,
  updateApiProjects: (() => {}) as (apiProjects: ApiProject[]) => void,
  updateApiWholeDict: (() => {}) as <T extends keyof BrowserApiWholeDict>(
    key: T,
    dict: BrowserApiWholeDict[T]
  ) => void,
})

export const BrowserProvider: React.FC = ({ children }) => {
  const [projects, setProjects] = useState<BrowserProject[]>([])
  const [apiProjects, setApiProjects] = useState<ApiProject[]>([])
  const [apiWholeDict, setApiWholeDict] = useState<BrowserApiWholeDict>({
    desksDict: {},
    revisionsDict: {},
    messagesDict: {},
  })
  const updateProjects = useCallback((projects: BrowserProject[]) => {
    setProjects(projects)
  }, [])
  const updateProject = useCallback((project: BrowserProject) => {
    setProjects((ps) => ps.map((p) => (p.id === project.id ? project : p)))
  }, [])
  const updateApiProjects = useCallback((apiProjects: ApiProject[]) => {
    setApiProjects(apiProjects)
  }, [])
  const updateApiWholeDict = useCallback(
    <T extends keyof BrowserApiWholeDict>(key: T, dict: BrowserApiWholeDict[T]) => {
      setApiWholeDict((d) => ({ ...d, [key]: { ...d[key], ...dict } }))
    },
    []
  )

  return (
    <BrowserContext.Provider
      value={{
        projects,
        apiWholeDict,
        apiProjects,
        updateProjects,
        updateProject,
        updateApiProjects,
        updateApiWholeDict,
      }}
    >
      {children}
    </BrowserContext.Provider>
  )
}
