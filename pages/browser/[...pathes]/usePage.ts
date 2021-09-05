import useAspidaSWR from '@aspida/swr'
import { useRouter } from 'next/dist/client/router'
import { useContext, useEffect, useMemo } from 'react'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { ApiWork, BrowserProject, ProjectApiData, ProjectId } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { forceToggleHash } from '~/utils/constants'

const findWork = (projectApiData: ProjectApiData | undefined, deskName: string, path: string) =>
  projectApiData?.desks
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

const getTabParams = (project: BrowserProject, work?: ApiWork) =>
  work
    ? {
        openedTabId: work.id,
        tabs: project.tabs.some((t) => t.id === work.id) ? project.tabs : [...project.tabs, work],
      }
    : undefined

export const usePage = () => {
  const { projects, apiWholeData, updateProjects, updateProject, updateApiWholeData } =
    useContext(BrowserContext)
  const { query, asPath, replace } = useRouter()
  const projectId = (Array.isArray(query.pathes) ? query.pathes[0] : '') as ProjectId
  const deskName = Array.isArray(query.pathes) ? query.pathes[1] : ''
  const path =
    Array.isArray(query.pathes) && query.pathes.length > 2
      ? `/${query.pathes.slice(2).join('/')}`
      : ''
  const enabled = !!projectId
  const { api } = useApi()
  const projectsRes = useAspidaSWR(api.browser.projects, { enabled })
  const desksRes = useAspidaSWR(api.browser.projects._projectId(projectId), { enabled })
  const currentProject = useMemo(() => projects.find((p) => p.id === projectId), [projects])
  const projectApiData = useMemo((): ProjectApiData | undefined => {
    const data = apiWholeData.projects?.find((p) => p.id === projectId)
    const desks = apiWholeData.desksList.find((d) => d.projectId === projectId)?.desks

    return (
      data &&
      desks && {
        projectId,
        name: data.name,
        desks,
        revisionsList: apiWholeData.revisionsList.filter((d) => d.projectId === projectId),
        messagesList: apiWholeData.messagesList.filter((d) => d.projectId === projectId),
      }
    )
  }, [apiWholeData, projectId])

  useEffect(() => {
    if (!projectsRes.data) return

    updateApiWholeData('projects', projectsRes.data)
    updateProjects(
      projectsRes.data.map((d) => ({
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
    const selectedFullPath = `${currentProject?.id}/${deskName}${path}`
    const forceToggle = asPath.endsWith(forceToggleHash)

    if (
      !projectApiData ||
      !currentProject ||
      [!forceToggle, currentProject.selectedFullPath === selectedFullPath].every(Boolean)
    ) {
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
    error: [projectsRes.error, desksRes.error].find(Boolean),
    projectApiData,
    projects,
    currentProject,
  }
}
