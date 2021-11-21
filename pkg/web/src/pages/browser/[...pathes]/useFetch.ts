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
  const { apiWholeDict, updateProjects, updateApiProjects, updateApiWholeDict } =
    useContext(BrowserContext)
  const { api } = useApi()
  const enabled = !!projectId
  const projectsRes = useAspidaSWR(api.browser.projects, { enabled })
  const desksRes = useAspidaSWR(api.browser.projects._projectId(projectId ?? ''), { enabled })
  const revisionsRes = useAspidaSWR(
    api.browser.projects
      ._projectId(projectId ?? '')
      .works._workId(currentProject?.openedTabId ?? '').revisions,
    { enabled: !!currentProject?.openedTabId }
  )

  const updateMessage = useCallback(
    async (revisionsData: { workId: WorkId; revisions: ApiRevision[] }) => {
      const messages = await Promise.all(
        revisionsData.revisions.map((revision) =>
          api.browser.projects
            ._projectId(projectId ?? '')
            .works._workId(currentProject?.openedTabId ?? '')
            .revisions._revisionId(revision.id)
            .messages.$get()
        )
      )
      updateApiWholeDict(
        'messagesDict',
        messages.reduce((dict, m) => ({ ...dict, [m.revisionId]: m.messages }), {})
      )
    },
    [projectId, apiWholeDict?.messagesDict]
  )

  useEffect(() => {
    const projectsData = projectsRes.data
    if (!projectsData) return

    updateApiProjects(projectsData)
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

    updateApiWholeDict('desksDict', { [desksData.projectId]: desksData.desks })
  }, [desksRes.data])

  useEffect(() => {
    const revisionsData = revisionsRes.data
    if (!revisionsData) return

    updateApiWholeDict('revisionsDict', { [revisionsData.workId]: revisionsData.revisions })
    updateMessage(revisionsData)
  }, [revisionsRes.data])

  return {
    error: [projectsRes.error, desksRes.error, revisionsRes.error, revisionsRes.error].find(
      Boolean
    ),
  }
}
