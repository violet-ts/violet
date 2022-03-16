import useAspidaSWR from '@aspida/swr'
import type { Cursor } from '@violet/lib/types/api'
import type { RevisionId, WorkId } from '@violet/lib/types/branded'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { BrowserPageParams, BrowserProject } from '@violet/web/src/types/browser'
import { useWorkPath } from '@violet/web/src/utils'
import { pagesPath } from '@violet/web/src/utils/$path'
import { forceToggleHash } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useMemo } from 'react'
import { createOperation, hasNoChange, namesToCurrents, toBrowserMessages } from './utils'

const useFetch = (
  project: BrowserProject | undefined,
  workId: WorkId | undefined,
  revisionCursor: Cursor<RevisionId> | undefined
) => {
  const { updateProjects, updateWholeDict } = useBrowserContext()
  const { api } = useApiContext()
  const projectsRes = useAspidaSWR(api.browser.projects)
  const enabled = !!project
  const dirsRes = useAspidaSWR(api.browser.projects.pId._projectId(project?.id ?? '').dirs, {
    enabled,
  })
  const revisionsRes = useAspidaSWR(
    api.browser.projects.pId._projectId(project?.id ?? '').works._workId(workId ?? '').revisions,
    {
      query: revisionCursor ?? ({} as Cursor<RevisionId>),
      enabled: [project, workId, revisionCursor].every(Boolean),
    }
  )

  useEffect(() => {
    if (projectsRes.data) updateProjects(projectsRes.data)
  }, [projectsRes.data, updateProjects])

  useEffect(() => {
    const dirs = dirsRes.data
    if (!dirs || !project) return

    updateWholeDict('dirsForProjectId', {
      [project.id]: dirs.map((d) => ({
        ...d,
        projectId: project.id,
        works: d.works.map((w) => ({ ...w, dirId: d.id })),
      })),
    })
  }, [dirsRes.data, project, updateWholeDict])

  useEffect(() => {
    const revisions = revisionsRes.data
    if (!revisions || !workId) return

    updateWholeDict('revisionsForWorkId', {
      [workId]: revisions.map(({ messages: _, ...r }) => ({ ...r, workId })),
    })
    updateWholeDict(
      'messagesForRevisionId',
      revisions.reduce((dict, r) => ({ ...dict, [r.id]: toBrowserMessages(r) }), {})
    )
  }, [revisionsRes.data, workId, updateWholeDict])

  return { error: [projectsRes.error, dirsRes.error, revisionsRes.error].find(Boolean) }
}

export const usePage = ():
  | ({ error: Error } & { [P in keyof BrowserPageParams]?: undefined })
  | ({ error?: undefined } & BrowserPageParams) => {
  const { operationDataDict, projects, wholeDict, updateOperationData } = useBrowserContext()
  const { asPath, replace, push } = useRouter()
  const { projectName, dirOrWorkNames } = useWorkPath()
  const { api, onErr } = useApiContext()

  const getCurrentProjectName = async (projectName: string | undefined) => {
    if (!projectName) return
    const projectRes = await api.browser.projects.pName._projectName(projectName).get().catch(onErr)
    const currentProjectName = projectRes ? projectRes.body.name : undefined
    if (currentProjectName)
      await push(pagesPath.browser._paths([currentProjectName, ...(dirOrWorkNames ?? [])]).$url())
  }
  const currentProject = useMemo(
    () => projects.find((p) => p.name === projectName),
    [projects, projectName]
  )

  if (!currentProject) void getCurrentProjectName(projectName)

  const currentDirsAndWork = useMemo(() => {
    if (!currentProject || !dirOrWorkNames) return undefined

    return namesToCurrents(wholeDict.dirsForProjectId[currentProject.id], dirOrWorkNames)
  }, [currentProject, wholeDict.dirsForProjectId, dirOrWorkNames])
  const revisionCursor = useMemo((): Cursor<RevisionId> | undefined => {
    if (!currentDirsAndWork?.work?.latestRevisionId) return undefined

    return {
      take: -3,
      cursorId: currentDirsAndWork.work.latestRevisionId,
      skipCursor: false,
    }
  }, [currentDirsAndWork])
  const { error } = useFetch(currentProject, currentDirsAndWork?.work?.id, revisionCursor)

  useEffect(() => {
    if (!currentProject || !currentDirsAndWork) return

    const { tabs, activeTab, openedDirDict } = operationDataDict[currentProject.id]
    const tailDirId = currentDirsAndWork.dirs.slice(-1)[0].id

    if (asPath.endsWith(forceToggleHash)) {
      updateOperationData(currentProject.id, {
        tabs,
        activeTab,
        openedDirDict: { ...openedDirDict, [tailDirId]: !openedDirDict[tailDirId] },
      })
      void replace(asPath.replace(forceToggleHash, ''))
      return
    }

    if (hasNoChange(currentDirsAndWork.work, activeTab, tailDirId)) return

    updateOperationData(
      currentProject.id,
      createOperation(currentDirsAndWork, tailDirId, tabs, openedDirDict)
    )
  }, [currentProject, operationDataDict, asPath, currentDirsAndWork, replace, updateOperationData])

  return projects
    ? {
        currentProject,
        currentDirsAndWork,
        operationData: currentProject && operationDataDict[currentProject.id],
        projects,
        wholeDict,
      }
    : { error }
}
