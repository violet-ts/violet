import useAspidaSWR from '@aspida/swr'
import type { ApiRevision } from '@violet/lib/types/api'
import type { ProjectId, WorkId } from '@violet/lib/types/branded'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { BrowserProject } from '@violet/web/src/types/browser'
import { useCallback, useContext, useEffect } from 'react'

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

  const updateMessage = useCallback(
    async (revisionsData: { workId: WorkId; revisions: ApiRevision[] }) => {
      const message = await Promise.all(
        revisionsData.revisions.map((revision) =>
          api.browser.works
            ._workId(currentProject?.openedTabId ?? '')
            .revisions._revisionId(revision.id)
            .messages.$get()
        )
      )
      updateApiWholeData('messagesList', message)
    },
    [apiWholeData.messagesList]
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
    updateMessage(revisionsData)
  }, [revisionsRes.data])

  return {
    error: [projectsRes.error, desksRes.error, revisionsRes.error, revisionsRes.error].find(
      Boolean
    ),
  }
}
