import { css } from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

export type SelectableStyleProps = { selected: boolean }

const alpha = (selected: boolean) => (selected ? alphaLevel[2] : alphaLevel[1])

export const SelectableStyle = css<SelectableStyleProps>`
  cursor: pointer;
  background: ${(props) => (props.selected ? `${colors.violet}${alpha(true)}` : 'none')};
  transition: background 0.2s;

  :hover {
    background: ${colors.violet}${(props) => alpha(props.selected)};
  }
`
