import useAspidaSWR from '@aspida/swr'
import { useContext, useEffect } from 'react'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import type { BrowserProject, ProjectId } from '~/server/types'

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
  const revisionIdToGetMessage = revisionsRes?.data?.revisions?.slice(-1).map((c) => c.id)
  const messagesRes = useAspidaSWR(
    api.browser.works
      ._workId(currentProject?.openedTabId ?? '')
      .revisions._revisionId(revisionIdToGetMessage?.[0] ?? '')
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

  useEffect(() => {
    const messageData = messagesRes.data
    if (!messageData) return

    updateApiWholeData(
      'messagesList',
      apiWholeData.messagesList.some((r) => r.revisionId === messageData.revisionId)
        ? apiWholeData.messagesList.map((r) =>
            r.revisionId === messageData.revisionId ? messageData : r
          )
        : [...apiWholeData.messagesList, messageData]
    )
  }, [messagesRes.data])

  return {
    error: [projectsRes.error, desksRes.error, revisionsRes.error, revisionsRes.error].find(
      Boolean
    ),
  }
}
