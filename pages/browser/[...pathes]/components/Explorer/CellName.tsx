import Link from 'next/link'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { BrowserContext } from '~/contexts/Browser'
import { useApi } from '~/hooks'
import { getProjectInfo } from '~/utils'
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

const AddAreaParent = styled.div`
  display: none;
`

const LabelArea = styled.div`
  position: relative;
  display: flex;
  :hover {
    ${AddAreaParent} {
      display: inline-block;
    }
  }
`

const Label = styled.div`
  flex: 1;
  padding: 0.5px;
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
  const [isClickNewAddFile, setIsClickNewAddFile] = useState(false)
  const [isClickNewAddFolder, setIsClickNewAddFolder] = useState(false)
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

  const AddNewFile = () => {
    openInputField()
    setIsClickNewAddFile(true)
  }

  const AddNewFolder = () => {
    openInputField()
    setIsClickNewAddFolder(true)
  }
  const submitNew = async (path: string, name: string, ext?: string) => {
    const { projectId, deskName } = getProjectInfo(pathChunks)
    const desks = await api.browser.projects._projectId(projectId).desks.$get()
    const desk = desks.desks.find((d) => d.name === deskName)
    if (!desk) return
    await api.browser.projects
      ._projectId(projectId)
      .desks._deskId(desk.id)
      .post({ body: { path, name, ext } })
      .catch(onErr)
    const deskRes = await api.browser.projects._projectId(projectId).desks.$get()

    updateApiWholeData(
      'desksList',
      apiWholeData.desksList.map((d) => (d.projectId === deskRes.projectId ? deskRes : d))
    )
    setIsClickNewAdd(false)
  }
  const createNew = () => {
    const pathArray = pathChunks.filter((d) => pathChunks.indexOf(d) > 1)
    if (isClickNewAddFile) {
      const path = `/${pathArray.join('/')}`
      const name = label.substring(0, label.lastIndexOf('.'))
      const ext = label.substring(label.lastIndexOf('.') + 1, label.length)
      submitNew(path, name, ext)
    }
    if (isClickNewAddFolder) {
      const path = `/${pathArray.join('/')}/${label}`
      submitNew(path, '')
    }
    setIsClickNewAddFile(false)
    setIsClickNewAddFolder(false)
  }
  const sendNewName = (e: FormEvent) => {
    e.preventDefault()
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
          <LabelArea>
            {props.isWork ? (
              <>
                <ExtIcon name={props.name} />
                <Spacer axis="x" size={6} />
                <Label>{props.name}</Label>
              </>
            ) : (
              <>
                <Arrow opened={props.opened} />
                <Spacer axis="x" size={18} />
                <Label>{props.name}</Label>
                <AddAreaParent>
                  <AddArea addFile={AddNewFile} addFolder={AddNewFolder} />
                </AddAreaParent>
              </>
            )}
          </LabelArea>
          {isClickNewAdd && !isFocusing && (
            <NewFileFolderArea depth={pathChunks.length - 1}>
              <form onSubmit={sendNewName}>
                <input ref={inputElement} type="text" onBlur={sendNewName} onChange={inputLabel} />
              </form>
            </NewFileFolderArea>
          )}
        </Container>
      )}
    </Link>
  )
}
