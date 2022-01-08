import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import { css } from 'styled-components'

export type ActiveStyleProps = { active: boolean }

export type MoveStyleProps = { move: boolean }

const alpha = (active: boolean) => (active ? alphaLevel[2] : alphaLevel[1])

export const ActiveStyle = css<ActiveStyleProps>`
  cursor: pointer;
  background: ${(props) => (props.active ? `${colors.violet}${alpha(true)}` : 'none')};
  transition: background 0.2s;

  :hover {
    background: ${colors.violet}${(props) => alpha(props.active)};
  }
`
export const MoveStyle = css<MoveStyleProps>`
  cursor: pointer;
  background: ${(props) => (props.move ? `${colors.blue}${alpha(true)}` : 'none')};
  transition: background 0.2s;
`
