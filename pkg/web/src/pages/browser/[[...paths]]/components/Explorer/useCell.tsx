import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type {
  BrowserDir,
  BrowserProject,
  BrowserWork,
  DirsDict,
} from '@violet/web/src/types/browser'
import { getPathNames } from '@violet/web/src/utils'
import { pagesPath } from '@violet/web/src/utils/$path'
import { forceToggleHash } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const useCell = (props: {
  project: BrowserProject
  dir: BrowserDir
  work?: BrowserWork
  active: boolean
  dirsDict: DirsDict
  opened?: boolean
}) => {
  const pathChunks = useMemo(
    () => getPathNames(props.project, props.dirsDict, props.dir, props.work),
    [props.project, props.dirsDict, props.dir, props.work]
  )
  const [isAdding, setIsAdding] = useState(false)
  const [isFocusing, setIsFocusing] = useState(false)
  const [label, setLabel] = useState('')
  const [isForbiddenChar, setIsForbiddenChar] = useState(false)
  const [forbidenChar, setForbiddenChar] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
    validationCheck(e.target.value)
  }, [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApiContext()
  const { wholeDict, updateWholeDict } = useBrowserContext()
  const { asPath, replace } = useRouter()
  const [editingType, setEditingType] = useState<'dir' | 'work'>('dir')
  const href = useMemo(
    () =>
      pagesPath.browser
        ._paths(pathChunks)
        .$url(props.active && !props.work ? { hash: forceToggleHash } : undefined),
    [props.active, props.work, pathChunks]
  )
  const openInputField = () => {
    setIsFocusing(false)
    setIsAdding(true)
    setIsForbiddenChar(false)
  }
  const addWork = () => {
    openInputField()
    setEditingType('work')
  }
  const addDir = () => {
    openInputField()
    setEditingType('dir')
  }
  const createDir = async () => {
    const dirs = await api.browser.projects.pId
      ._projectId(props.project.id)
      .dirs.$post({ body: { parentDirId: props.dir.id, names: label.split('/') } })
      .catch(onErr)
    if (!dirs) return

    updateWholeDict('dirsForProjectId', {
      [props.project.id]: dirs.map((d) => ({
        ...d,
        projectId: props.project.id,
        works: d.works.map((w) => ({ ...w, dirId: d.id })),
      })),
    })
  }
  const createWork = async () => {
    const works = await api.browser.projects.pId
      ._projectId(props.project.id)
      .works.$post({ body: { name: label, parentDirId: props.dir.id } })
      .catch(onErr)
    if (!works) return

    updateWholeDict('dirsForProjectId', {
      [props.project.id]: wholeDict.dirsForProjectId[props.project.id].map((d) =>
        d.id === props.dir.id ? { ...d, works: works.map((w) => ({ ...w, dirId: d.id })) } : d
      ),
    })
  }
  const sendNewName = async (e: FormEvent) => {
    e.preventDefault()
    setIsFocusing(!label)
    if (label) {
      await (editingType === 'dir' ? createDir() : createWork())
      await replace(`${asPath}/${label}`)
      setIsAdding(false)
    }
    setLabel('')
  }
  useEffect(() => {
    inputElement.current?.focus()
  })
  const openInputBox = (e: FormEvent) => {
    e.stopPropagation()
  }
  const validationCheck = (label: string) => {
    if (!inputElement.current) return
    setIsForbiddenChar(false)
    const pattern = /[\\^\\&\\'\\@\\{\\}\\,\\$\\=\\!\\#\\.\\%\\+\\~\\/\\<\\>\\"\\*\\?\\|\\:\\]+$/
    if (!pattern.test(label)) return
    inputElement.current.value = inputElement.current.value.slice(0, -1)
    setForbiddenChar(inputElement.current.value.slice(-1))
    setLabel(inputElement.current.value)
    setIsForbiddenChar(true)
  }
  return {
    addWork,
    addDir,
    sendNewName,
    openInputBox,
    inputLabel,
    isAdding,
    isFocusing,
    isForbiddenChar,
    forbidenChar,
    href,
    pathChunks,
    inputElement,
  }
}
