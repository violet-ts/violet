import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { colors } from '~/utils/constants'
import { ExtIcon } from '../ExtIcon'
import { SelectableStyle } from '../SelectableStyle'

const Container = styled.div<{ depth: number; selected: boolean; bold?: boolean }>`
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

export const CellName = (props: {
  name: string
  selected: boolean
  fullPath: string
  isWork?: boolean
  opened?: boolean
  bold?: boolean
  onClick: () => void
}) => {
  return (
    <Container
      depth={props.fullPath.split('/').length}
      selected={props.selected}
      bold={props.bold}
      onClick={props.onClick}
    >
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
          </>
        )}
        {props.name}
      </Label>
    </Container>
  )
}
