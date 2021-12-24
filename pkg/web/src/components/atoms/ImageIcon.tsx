import styled from 'styled-components'
export const ImageIcon = styled.i`
  & {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 16px;
    height: 12px;
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0 0 0 2px;
    transform: scale(var(--ggs, 1));
  }

  &::after,
  &::before {
    position: absolute;
    box-sizing: border-box;
    display: block;
    content: '';
    border: 2px solid;
  }

  &::after {
    top: 8px;
    left: 5px;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    transform: rotate(45deg);
  }

  &::before {
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
    border-radius: 100%;
  }
`
