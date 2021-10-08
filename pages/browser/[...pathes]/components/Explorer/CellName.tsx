import Link from 'next/link'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
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
  const onClick = () => {
    setIsFocusing(false)
    setIsClickNewAdd(true)
  }
  const onBlur = () => {
    setIsFocusing(!label)
  }
  return (
    <Link href={href}>
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
              <AddArea addFile={onClick} addFolder={onClick} />
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
    </Link>
  )
}
