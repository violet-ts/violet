import { colors } from '@violet/web/src/utils/constants'
import styled from 'styled-components'

export const DataIcon = styled.i`
  color: ${colors.gray};
  transform: scale(var(--ggs, 1));

  &,
  ::after,
  ::before {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 14px;
    height: 14px;
    border: 2px solid;
    border-radius: 50%;
  }

  ::after,
  ::before {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
    content: '';
  }

  ::after {
    top: -6px;
    left: -6px;
    width: 22px;
    height: 22px;
    background: linear-gradient(to left, currentColor 8px, transparent 0) no-repeat bottom
      center/2px 8px;
  }

  &,
  ::after {
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
`
