import useAspidaSWR from '@aspida/swr'
import { useRouter } from 'next/dist/client/router'
import { useContext, useEffect, useMemo } from 'react'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { ProjectApiData, ProjectId } from '~/server/types'

export const usePage = () => {
  const { projects, apiWholeData, updateProjects, updateProject, updateApiWholeData } =
    useContext(BrowserContext)
  const { query } = useRouter()
  const projectId = (Array.isArray(query.pathes) ? query.pathes[0] : '') as ProjectId
  const enabled = !!projectId
  const { api } = useApi()
  const projectsRes = useAspidaSWR(api.browser.projects, { enabled })
  const desksRes = useAspidaSWR(api.browser.projects._projectId(projectId), { enabled })
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
    if (projects.some((p) => p.id === projectId)) return

    updateProjects([
      ...projects,
      {
        id: projectId,
        tabs: [],
        openedFullPathDict: {},
        openedTab: undefined,
        selectedFullPath: undefined,
      },
    ])
  }, [projectId, projects])

  return {
    error: [projectsRes.error, desksRes.error].find(Boolean),
    apiWholeData,
    projectApiData,
    project: projects.filter((p) => p.id === projectId)[0],
    updateProject,
  }
}
