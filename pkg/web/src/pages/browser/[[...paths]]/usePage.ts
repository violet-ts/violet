import useAspidaSWR from '@aspida/swr'
import type { ApiMessage, ApiReply, ApiRevision, Cursor } from '@violet/lib/types/api'
import type { DirId, RevisionId, WorkId } from '@violet/lib/types/branded'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserChildDir,
  BrowserDir,
  BrowserMessage,
  BrowserPageParams,
  BrowserProject,
  BrowserReply,
  BrowserRootDir,
  BrowserWork,
  CurrentDirsAndWork,
  OperationData,
  Tab,
} from '@violet/web/src/types/browser'
import { forceToggleHash } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useMemo } from 'react'

const toBrowserMessages = (
  r: ApiRevision & { messages: (ApiMessage & { replies: ApiReply[] })[] }
): BrowserMessage[] =>
  r.messages.map(
    (m): BrowserMessage => ({
      ...m,
      revisionId: r.id,
      replies: m.replies.map((rep): BrowserReply => ({ ...rep, messageId: m.id })),
    })
  )

const useFetch = (
  project: BrowserProject | undefined,
  workId: WorkId | undefined,
  revisionCursor: Cursor<RevisionId> | undefined
) => {
  const { updateProjects, updateWholeDict } = useBrowserContext()
  const { api } = useApiContext()
  const projectsRes = useAspidaSWR(api.browser.projects)
  const enabled = !!project
  const dirsRes = useAspidaSWR(api.browser.projects._projectId(project?.id ?? '').dirs, { enabled })
  const revisionsRes = useAspidaSWR(
    api.browser.projects._projectId(project?.id ?? '').works._workId(workId ?? '').revisions,
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

const namesToCurrents = (dirs: BrowserDir[], names: string[]) => {
  const rootDir = dirs.find((d): d is BrowserRootDir => d.name === names[0] && !d.parentDirId)
  return (
    rootDir &&
    names.slice(1).reduce<CurrentDirsAndWork | undefined>(
      (result, name, i, arr) => {
        if (!result) return undefined

        if (i + 1 === arr.length) {
          const work = result.dirs[i].works.find((w) => w.name === name)
          // eslint-disable-next-line max-depth -- 他に良い方法が思いつかなかった
          if (work) return { dirs: result.dirs, work }
        }

        const dir = dirs.find(
          (d): d is BrowserChildDir => d.parentDirId === result.dirs[i].id && d.name === name
        )
        return dir ? { dirs: [...result.dirs, dir], work: undefined } : undefined
      },
      { dirs: [rootDir], work: undefined }
    )
  )
}

const hasNoChange = (work: BrowserWork | undefined, activeTab: Tab | undefined, tailDirId: DirId) =>
  work ? work.id === activeTab?.id : tailDirId === activeTab?.id

const createOperation = (
  currentDirsAndWork: CurrentDirsAndWork,
  tailDirId: DirId,
  tabs: Tab[],
  openedDirDict: Record<DirId, boolean | undefined>
): OperationData => ({
  tabs: [
    ...[{ type: 'dir' as const, id: tailDirId }, ...tabs.slice(1)],
    ...(currentDirsAndWork.work && tabs.every((t) => t.id !== currentDirsAndWork.work?.id)
      ? [{ type: 'work' as const, id: currentDirsAndWork.work.id }]
      : []),
  ],
  activeTab: currentDirsAndWork.work
    ? { type: 'work', id: currentDirsAndWork.work.id }
    : { type: 'dir', id: tailDirId },
  openedDirDict: currentDirsAndWork.dirs.reduce(
    (dict, dir) => ({
      ...dict,
      [dir.id]: !!currentDirsAndWork.work || dir.id !== tailDirId || !openedDirDict[tailDirId],
    }),
    openedDirDict
  ),
})

export const usePage = ():
  | ({ error: Error } & { [P in keyof BrowserPageParams]?: undefined })
  | ({ error?: undefined } & BrowserPageParams) => {
  const { operationDataDict, projects, wholeDict, updateOperationData } = useBrowserContext()
  const { asPath, replace, query } = useRouter()
  const { paths } = query
  const { projectName, dirOrWorkNames } = useMemo(
    () => (Array.isArray(paths) ? { projectName: paths[0], dirOrWorkNames: paths.slice(1) } : {}),
    [paths]
  )
  const currentProject = useMemo(
    () => projects.find((p) => p.name === projectName),
    [projects, projectName]
  )
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
