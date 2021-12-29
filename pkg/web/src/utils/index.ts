import { pagesPath } from '@violet/web/src/utils/$path'
import type {
  BrowserDir,
  BrowserProject,
  BrowserWork,
  DirsDict,
  Tab,
  WorksDict,
} from '../types/browser'

export const getWorkFullName = (work: { name: string; ext?: string | null }) =>
  `${work.name}${work.ext ? `.${work.ext}` : ''}`

export const getPathNames = (
  project: BrowserProject,
  dict: DirsDict,
  dir: BrowserDir,
  work?: BrowserWork
): string[] =>
  work
    ? [...getPathNames(project, dict, dir), work.name]
    : dir.parentDirId
    ? [...getPathNames(project, dict, dict[dir.parentDirId]), dir.name]
    : [project.name, dir.name]

export const tabToHref = (
  tab: Tab | undefined,
  project: BrowserProject,
  dirsDict: DirsDict,
  worksDict: WorksDict
) =>
  pagesPath.browser
    ._paths(
      tab
        ? getPathNames(
            project,
            dirsDict,
            tab.type === 'dir' ? dirsDict[tab.id] : dirsDict[worksDict[tab.id].dirId],
            tab.type === 'work' ? worksDict[tab.id] : undefined
          )
        : [project.name]
    )
    .$url()
