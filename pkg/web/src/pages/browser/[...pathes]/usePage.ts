import type { ApiWork, BrowserProject, ProjectApiData, ProjectId } from '@violet/api/types'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { getWorkFullName } from '@violet/web/src/utils'
import { forceToggleHash } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import { useContext, useEffect, useMemo } from 'react'
import { useFetch } from './useFetch'

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
    const revisions = apiWholeData.revisionsList.find(
      (d) => d.workId === currentProject.openedTabId
    )?.revisions

    const messages = apiWholeData.messagesList.find((m) =>
      revisions?.find((revision) => revision.id === m.revisionId)
    )?.messages

    return (
      data &&
      desks && {
        projectId: currentProject.id,
        name: data.name,
        desks,
        revisions,
        messages,
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
