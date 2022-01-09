import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import { css } from 'styled-components'

export type MoveStyleProps = { move: boolean }
export const MoveStyle = css<MoveStyleProps>`
  cursor: pointer;
  background: ${(props) => (props.move ? `${colors.blue}${alphaLevel[2]}` : 'none')};
  transition: background 0.2s;
`
