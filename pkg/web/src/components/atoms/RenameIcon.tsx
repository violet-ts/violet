import styled from 'styled-components'
export const RenameIcon = styled.i`
  & {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 18px;
    height: 13px;
    background: linear-gradient(to left, currentColor 22px, transparent 0) no-repeat 6px center/2px
      22px;
    transform: scale(var(--ggs, 1));
  }
  &::after,
  &::before {
    position: absolute;
    top: 2px;
    box-sizing: border-box;
    display: block;
    width: 6px;
    height: 9px;
    content: '';
    border: 2px solid;
  }
  &::before {
    border-right: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  &::after {
    right: 0;
    width: 8px;
    border-left: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`
