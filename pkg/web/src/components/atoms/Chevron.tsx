import { colors } from '@violet/web/src/utils/constants'
import styled from 'styled-components'

export const ChevronUp = styled.button`
  position: relative;
  box-sizing: border-box;
  display: block;
  width: 36px;
  height: 36px;
  color: ${colors.violet};
  cursor: pointer;
  background-color: ${colors.transparent};
  border: 2px solid transparent;
  border-radius: 100px;
  transform: scale(var(--ggs, 1));
  ::after {
    position: absolute;
    bottom: 8px;
    left: 8px;
    box-sizing: border-box;
    display: block;
    width: 16px;
    height: 16px;
    content: '';
    border-top: 4px solid;
    border-right: 4px solid;
    transform: rotate(-45deg);
  }
`
