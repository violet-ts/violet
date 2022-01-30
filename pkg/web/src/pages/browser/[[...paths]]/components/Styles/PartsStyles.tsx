import { alphaLevel, colors, fontSizes, scrollbarSize } from '@violet/web/src/utils/constants'
import { css } from 'styled-components'

export type DisplayScrollBarStyleProps = { displayedScroll: boolean }

export const DisplayScrollBarStyle = css<DisplayScrollBarStyleProps>`
  overflow: overlay;

  ::-webkit-scrollbar {
    height: 0;
  }

  :hover {
    ::-webkit-scrollbar {
      height: ${(props) => (props.displayedScroll ? `${scrollbarSize}` : `0`)};
    }

    ::-webkit-scrollbar-thumb {
      background: ${colors.gray}${alphaLevel[3]};
    }
  }
`

export const FocusByTabKeyStyle = css`
  border: none;
  outline-color: ${colors.gray}${alphaLevel[5]};
`

export const FontStyle = css`
  font-size: ${fontSizes.small};
  color: ${colors.black}${alphaLevel[9]};
`
