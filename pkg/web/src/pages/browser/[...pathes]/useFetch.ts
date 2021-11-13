import useAspidaSWR from '@aspida/swr'
import type { ApiRevision, BrowserProject, ProjectId, WorkId } from '@violet/api/types'
import { BrowserContext } from '@violet/web/src//contexts/Browser'
import { useApi } from '@violet/web/src//hooks'
import { useContext, useEffect } from 'react'

export const useFetch = (
  projectId: ProjectId | undefined,
  currentProject: BrowserProject | undefined
) => {
  const { apiWholeData, updateProjects, updateApiWholeData } = useContext(BrowserContext)
  const { api } = useApi()
  const enabled = !!projectId
  const projectsRes = useAspidaSWR(api.browser.projects, { enabled })
  const desksRes = useAspidaSWR(api.browser.projects._projectId(projectId ?? ''), { enabled })
  const revisionsRes = useAspidaSWR(
    api.browser.works._workId(currentProject?.openedTabId ?? '').revisions,
    { enabled: !!currentProject?.openedTabId }
  )

  const updateMessage = async (revisionsData: { workId: WorkId; revisions: ApiRevision[] }) => {
    await Promise.all(
      revisionsData.revisions
        .flatMap((revision) => revision.id)
        .map((r) =>
          api.browser.works
            ._workId(currentProject?.openedTabId ?? '')
            .revisions._revisionId(r)
            .messages.$get()
        )
    ).then((message) => {
      updateApiWholeData('messagesList', message)
    })
  }

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

  useEffect(() => {
    const revisionsData = revisionsRes.data
    if (!revisionsData) return
    updateMessage(revisionsData)
  }, [revisionsRes.data])

  return {
    error: [projectsRes.error, desksRes.error, revisionsRes.error, revisionsRes.error].find(
      Boolean
    ),
  }
}
