import type { ApiMessage, ApiReply, ApiRevision } from '@violet/lib/types/api'
import type { DirId } from '@violet/lib/types/branded'
import type {
  BrowserChildDir,
  BrowserDir,
  BrowserMessage,
  BrowserReply,
  BrowserRootDir,
  BrowserWork,
  CurrentDirsAndWork,
  OperationData,
  Tab,
} from '@violet/web/src/types/browser'

export const namesToCurrents = (dirs: BrowserDir[], names: string[]) => {
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

export const hasNoChange = (
  work: BrowserWork | undefined,
  activeTab: Tab | undefined,
  tailDirId: DirId
) => (work ? work.id === activeTab?.id : tailDirId === activeTab?.id)

export const toBrowserMessages = (
  r: ApiRevision & { messages: (ApiMessage & { replies: ApiReply[] })[] }
): BrowserMessage[] =>
  r.messages.map(
    (m): BrowserMessage => ({
      ...m,
      revisionId: r.id,
      replies: m.replies.map((rep): BrowserReply => ({ ...rep, messageId: m.id })),
    })
  )

export const createOperation = (
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
