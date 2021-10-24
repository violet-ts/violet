import Link from 'next/link'
import type { ChangeEvent } from 'react'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import { pagesPath } from '~/utils/$path'
import { colors, forceToggleHash } from '~/utils/constants'
import { AddArea } from '../AddArea'
import { ExtIcon } from '../ExtIcon'
import { SelectableStyle } from '../SelectableStyle'

const Container = styled.a<{ depth: number; selected: boolean; bold?: boolean }>`
  display: block;
  padding: 6px 8px;
  padding-left: ${(props) => props.depth * 8}px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  ${SelectableStyle};
`

const Label = styled.div`
  position: relative;
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
  name: string
  selected: boolean
  fullPath: string
  isWork?: boolean
  opened?: boolean
  bold?: boolean
}) => {
  const pathChunks = props.fullPath.split('/')
  const [isClickNewAdd, setIsClickNewAdd] = useState(false)
  const [isFocusing, setIsFocusing] = useState(false)
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, updateApiWholeData } = useContext(BrowserContext)
  const [createNewFile, setCreateNewFile] = useState(false)
  const [createNewFolder, setCreateNewFolder] = useState(false)
  useEffect(() => {
    inputElement.current?.focus()
  }, [inputElement.current])
  const href = useMemo(
    () =>
      pagesPath.browser
        ._pathes(pathChunks)
        .$url(props.selected && !props.isWork ? { hash: forceToggleHash } : undefined),
    [props.selected, props.isWork]
  )
  const openInputField = () => {
    setIsFocusing(false)
    setIsClickNewAdd(true)
  }

  const onAddNewFile = () => {
    openInputField()
    setCreateNewFile(true)
  }

  const onAddNewFolder = () => {
    openInputField()
    setCreateNewFolder(true)
  }
  const submitNew = async (path: string, name: string, ext?: string) => {
    if (!path) return
    const desks = await api.browser.projects._projectId(pathChunks[0]).desks.$get()
    const desk = desks.desks.filter((d) => {
      if (d.name === pathChunks[1]) return d.id
    })[0]
    await api.browser.projects
      ._projectId(pathChunks[0])
      .desks._deskId(desk.id)
      .post({ body: { path, name, ext } })
      .catch(onErr)
    const deskRes = await api.browser.projects._projectId(pathChunks[0]).desks.$get()

    if (!deskRes) return
    updateApiWholeData(
      'desksList',
      apiWholeData.desksList.some((d) => d.projectId === deskRes.projectId)
        ? apiWholeData.desksList.map((d) => (d.projectId === deskRes.projectId ? deskRes : d))
        : [...apiWholeData.desksList, deskRes]
    )
    setIsClickNewAdd(false)
  }
  const createNew = () => {
    const pathArray = pathChunks.filter((d) => pathChunks.indexOf(d) > 1)
    if (createNewFile) {
      const path = `/${pathArray.join('/')}`
      const name = label.substring(0, label.lastIndexOf('.'))
      const ext = label.substring(label.lastIndexOf('.') + 1, label.length)
      submitNew(path, name, ext)
    }
    if (createNewFolder) {
      const path = `/${pathArray.join('/')}/${label}`
      submitNew(path, '')
    }
    setCreateNewFile(false)
    setCreateNewFolder(false)
  }
  const onBlur = () => {
    setIsFocusing(!label)
    if (label) {
      createNew()
    }
    setLabel('')
  }

  return (
    <Link href={href}>
      {props.name && (
        <Container depth={pathChunks.length - 1} selected={props.selected} bold={props.bold}>
          <Label>
            {props.isWork ? (
              <>
                <ExtIcon name={props.name} />
                <Spacer axis="x" size={6} />
              </>
            ) : (
              <>
                <Arrow opened={props.opened} />
                <Spacer axis="x" size={18} />
                <AddArea addFile={onAddNewFile} addFolder={onAddNewFolder} />
              </>
            )}
            {props.name}
          </Label>
          {isClickNewAdd && !isFocusing && (
            <NewFileFolderArea depth={pathChunks.length - 1}>
              <input ref={inputElement} type="text" onBlur={onBlur} onChange={inputLabel} />
            </NewFileFolderArea>
          )}
        </Container>
      )}
    </Link>
  )
}
