import useAspidaSWR from '@aspida/swr'
import { useRouter } from 'next/dist/client/router'
import { useContext, useEffect, useMemo } from 'react'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { ApiWork, BrowserProject, ProjectApiData, ProjectId } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { forceToggleHash } from '~/utils/constants'

const findWork = (
  projectApiData: ProjectApiData,
  deskName: string | undefined,
  path: string | undefined
) =>
  projectApiData.desks
    .find((d) => d.name === deskName)
    ?.works.find((w) => `${w.path}/${getWorkFullName(w)}` === path)

const getOpenedFullPathDict = (
  project: BrowserProject,
  selectedFullPath: string,
  isWork: boolean
) => {
  const willOpen = isWork || !project.openedFullPathDict[selectedFullPath]

  return willOpen
    ? selectedFullPath.split('/').reduce(
        (p, _, i, arr) => ({
          ...p,
          [selectedFullPath
            .split('/')
            .slice(0, arr.length - i)
            .join('/')]: true,
        }),
        project.openedFullPathDict
      )
    : {
        ...project.openedFullPathDict,
        [selectedFullPath]: false,
      }
}

const getTabParams = (project: BrowserProject, work: ApiWork | undefined) =>
  work
    ? {
        openedTabId: work.id,
        tabs: project.tabs.some((t) => t.id === work.id) ? project.tabs : [...project.tabs, work],
      }
    : undefined

const useFetch = (projectId: ProjectId | undefined, currentProject: BrowserProject | undefined) => {
  const { apiWholeData, updateProjects, updateApiWholeData } = useContext(BrowserContext)
  const { api } = useApi()
  const enabled = !!projectId
  const projectsRes = useAspidaSWR(api.browser.projects, { enabled })
  const desksRes = useAspidaSWR(api.browser.projects._projectId(projectId ?? ''), { enabled })
  const revisionsRes = useAspidaSWR(
    api.browser.works._workId(currentProject?.openedTabId ?? '').revisions,
    { enabled: !!currentProject?.openedTabId }
  )

  useEffect(() => {
    const projectsData = projectsRes.data
    if (!projectsData) return

    updateApiWholeData('projects', projectsData)
    updateProjects(
      projectsData.map((d) => ({
        ...d,
        tabs: [],
        openedFullPathDict: {},
        openedTabId: undefined,
        selectedFullPath: d.id,
      }))
    )
  }, [projectsRes.data])

  useEffect(() => {
    const desksData = desksRes.data
    if (!desksData) return

    updateApiWholeData(
      'desksList',
      apiWholeData.desksList.some((d) => d.projectId === desksData.projectId)
        ? apiWholeData.desksList.map((d) => (d.projectId === desksData.projectId ? desksData : d))
        : [...apiWholeData.desksList, desksData]
    )
  }, [desksRes.data])

  useEffect(() => {
    const revisionsData = revisionsRes.data
    if (!revisionsData) return

    updateApiWholeData(
      'revisionsList',
      apiWholeData.revisionsList.some((r) => r.workId === revisionsData.workId)
        ? apiWholeData.revisionsList.map((r) =>
            r.workId === revisionsData.workId ? revisionsData : r
          )
        : [...apiWholeData.revisionsList, revisionsData]
    )
  }, [revisionsRes.data])

  return { error: [projectsRes.error, desksRes.error, revisionsRes.error].find(Boolean) }
}

const usePathValues = (): {
  projectId: ProjectId | undefined
  deskName: string | undefined
  path: string | undefined
} => {
  const {
    query: { pathes },
  } = useRouter()
  if (!Array.isArray(pathes)) return { projectId: undefined, deskName: undefined, path: undefined }

  const projectId = pathes[0] as ProjectId
  const deskName = pathes.length > 1 ? pathes[1] : undefined
  const path = pathes.length > 2 ? `/${pathes.slice(2).join('/')}` : undefined

  return { projectId, deskName, path }
}

const getFullPath = (
  projectId: ProjectId,
  deskName: string | undefined,
  path: string | undefined
) => `${projectId}${deskName ? `/${deskName}` : ''}${path ?? ''}`

export const usePage = () => {
  const { projects, apiWholeData, updateProject } = useContext(BrowserContext)
  const { asPath, replace } = useRouter()
  const { projectId, deskName, path } = usePathValues()
  const currentProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  )
  const { error } = useFetch(projectId, currentProject)
  const projectApiData = useMemo((): ProjectApiData | undefined => {
    if (!currentProject) return

    const data = apiWholeData.projects?.find((p) => p.id === currentProject.id)
    const desks = apiWholeData.desksList.find((d) => d.projectId === currentProject.id)?.desks

    return (
      data &&
      desks && {
        projectId: currentProject.id,
        name: data.name,
        desks,
        revisions: apiWholeData.revisionsList.find((d) => d.workId === currentProject.openedTabId)
          ?.revisions,
        messages: undefined,
      }
    )
  }, [apiWholeData, currentProject])

  useEffect(() => {
    if (!currentProject || !projectApiData) return

    const selectedFullPath = getFullPath(currentProject.id, deskName, path)
    const forceToggle = asPath.endsWith(forceToggleHash)

    if ([!forceToggle, currentProject.selectedFullPath === selectedFullPath].every(Boolean)) {
      return
    }

    const work = findWork(projectApiData, deskName, path)

    updateProject({
      ...currentProject,
      ...getTabParams(currentProject, work),
      selectedFullPath,
      openedFullPathDict: getOpenedFullPathDict(currentProject, selectedFullPath, !!work),
    })

    if (forceToggle) replace(asPath.split('#')[0])
  }, [currentProject, deskName, path, asPath, projectApiData])

  return {
    error,
    projectApiData,
    projects,
    currentProject,
  }
}
