import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { alphaLevel, colors, fontSizes } from '~/utils/constants'

const alpha = (selected: boolean) => (selected ? alphaLevel[3] : alphaLevel[2])

const Container = styled.div<{ depth: number; selected: boolean; bold?: boolean }>`
  padding: 6px 8px;
  padding-left: ${(props) => props.depth * 8}px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  cursor: pointer;
  background: ${(props) => (props.selected ? `${colors.violet}${alpha(true)}` : 'none')};
  transition: background 0.2s;

  :hover {
    background: ${colors.violet}${(props) => alpha(props.selected)};
  }
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

const ExtIcon = styled.span<{ color: string }>`
  display: inline-block;
  width: 20px;
  padding: 2px 0 4px;
  font-size: ${fontSizes.mini};
  color: ${colors.white};
  text-align: center;
  vertical-align: bottom;
  background: ${(props) => props.color};
  border-radius: 4px;
`

const getIconValue = (name: string): { label: string; color: string } =>
  ({
    word: { label: 'wd', color: colors.blue },
    xlsx: { label: 'xl', color: colors.green },
    jpg: { label: 'jg', color: colors.yellow },
    htaccess: { label: 'ht', color: colors.red },
    gitignore: { label: 'gi', color: colors.gray },
  }[name.split('.').pop() ?? ''] ?? { label: 'fi', color: colors.gray })

export const CellName = (props: {
  depth: number
  name: string
  selected: boolean
  isWork?: boolean
  opened?: boolean
  bold?: boolean
  onClick: () => void
}) => {
  return (
    <Container
      depth={props.depth}
      selected={props.selected}
      bold={props.bold}
      onClick={props.onClick}
    >
      <Label>
        {props.isWork ? (
          <>
            <ExtIcon color={getIconValue(props.name).color}>
              {getIconValue(props.name).label}
            </ExtIcon>
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
