import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { SpeechBubble } from '@violet/web/src/components/atoms/SpeechBubble'
import type {
  BrowserDir,
  BrowserProject,
  BrowserWork,
  DirsDict,
} from '@violet/web/src/types/browser'
import { colors } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import styled from 'styled-components'
import { AddArea } from '../AddArea'
import { ActiveStyle } from '../Styles/ActiveStyle'
import { useCell } from './useCell'

const Container = styled.a<{ depth: number; active: boolean }>`
  display: block;
  padding: 5px 8px;
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
  height: 18px;
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

const NewDirWorkArea = styled.div<{ depth: number }>`
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
  const {
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
  } = useCell(props)

  return (
    <Link href={href}>
      <Container depth={pathChunks.length - 1} active={props.active}>
        <LabelArea>
          {props.work ? (
            <>
              <Spacer axis="x" size={6} />
              <Label>{props.work.name}</Label>
            </>
          ) : (
            <>
              <Arrow opened={props.opened} />
              <Spacer axis="x" size={18} />
              <AddAreaParent onClick={openInputBox}>
                <AddArea addWork={addWork} addDir={addDir} />
              </AddAreaParent>
              <Label>{props.dir.name}</Label>
            </>
          )}
        </LabelArea>
        {isAdding && !isFocusing && (
          <NewDirWorkArea depth={pathChunks.length - 1}>
            <form onSubmit={sendNewName}>
              <input ref={inputElement} type="text" onBlur={sendNewName} onChange={inputLabel} />
            </form>
            {isForbiddenChar && <SpeechBubble>{forbidenChar} は入力できません。</SpeechBubble>}
          </NewDirWorkArea>
        )}
      </Container>
    </Link>
  )
}
