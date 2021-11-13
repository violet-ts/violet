import styled from 'styled-components'
export const RenameIcon = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 18px;
    height: 13px;
    transform: scale(var(--ggs, 1));
    background: linear-gradient(to left, currentColor 22px, transparent 0) no-repeat 6px center/2px
      22px;
  }
  &::after,
  &::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 6px;
    height: 9px;
    border: 2px solid;
    top: 2px;
  }
  &::before {
    border-right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  &::after {
    width: 8px;
    border-left: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    right: 0;
  }
`
