import { Spacer } from '@violet/web/src/components/atoms/Spacer'
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
import { colors, forceToggleHash } from '@violet/web/src/utils/constants'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { ActiveStyle } from '../ActiveStyle'
import { AddArea } from '../AddArea'
import { ExtIcon } from '../ExtIcon'

const Container = styled.a<{ depth: number; active: boolean }>`
  display: block;
  padding: 6px 8px;
  padding-left: ${(props) => props.depth * 8}px;
  ${ActiveStyle};
`

const AddAreaParent = styled.div`
  display: none;
  order: 1;
`

const LabelArea = styled.div`
  position: relative;
  display: flex;
  :hover ${AddAreaParent} {
    display: block;
  }
`

const Label = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Arrow = styled.div<{ opened?: boolean }>`
  position: absolute;
  top: ${(props) => (props.opened ? 3 : 4)}px;
  left: ${(props) => (props.opened ? 2 : 0)}px;
  width: 8px;
  height: 8px;
  content: '';
  border-right: 1px solid ${colors.black};
  border-bottom: 1px solid ${colors.black};
  transform: rotate(${(props) => (props.opened ? '' : '-')}45deg);
`

const NewFileFolderArea = styled.div<{ depth: number }>`
  display: block;
  padding: 6px 8px;
  padding-left: ${(props) => props.depth * 8}px;
`

export const CellName = (props: {
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
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
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
    const dirs = await api.browser.projects
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
    const works = await api.browser.projects
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

  return (
    <Link href={href}>
      <Container depth={pathChunks.length - 1} active={props.active}>
        <LabelArea>
          {props.work ? (
            <>
              <ExtIcon name={props.work.name} />
              <Spacer axis="x" size={6} />
              <Label>{props.work.name}</Label>
            </>
          ) : (
            <>
              <Arrow opened={props.opened} />
              <Spacer axis="x" size={18} />
              <AddAreaParent>
                <AddArea addWork={addWork} addDir={addDir} />
              </AddAreaParent>
              <Label>{props.dir.name}</Label>
            </>
          )}
        </LabelArea>
        {isAdding && !isFocusing && (
          <NewFileFolderArea depth={pathChunks.length - 1}>
            <form onSubmit={sendNewName}>
              <input ref={inputElement} type="text" onBlur={sendNewName} onChange={inputLabel} />
            </form>
          </NewFileFolderArea>
        )}
      </Container>
    </Link>
  )
}
