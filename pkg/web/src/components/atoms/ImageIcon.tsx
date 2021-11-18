import styled from 'styled-components'
export const ImageIcon = styled.i`
  & {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 16px;
    height: 12px;
    overflow: hidden;
    box-shadow: 0 0 0 2px;
    border-radius: 2px;
  }
  &::after,
  &::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    border: 2px solid;
  }
  &::after {
    transform: rotate(45deg);
    border-radius: 3px;
    width: 14px;
    height: 14px;
    top: 8px;
    left: 5px;
  }
  &::before {
    width: 6px;
    height: 6px;
    border-radius: 100%;
    top: 2px;
    left: 2px;
  }
`
