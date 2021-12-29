import styled from 'styled-components'

type Props = { size: number }

export const Cross = styled.div<Props>`
  position: relative;
  box-sizing: border-box;
  display: block;
  transform: scale(var(--ggs, 1));
  ::after,
  ::before {
    position: absolute;
    box-sizing: border-box;
    display: block;
    width: ${({ size }) => size}px;
    height: 1.2px;
    content: '';
    background: currentColor;
    border-radius: 8px;
    transform: rotate(45deg);
  }
  ::after {
    transform: rotate(-45deg);
  }
`
