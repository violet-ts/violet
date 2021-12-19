import styled from 'styled-components'

type Props = { size: number }
const getTopPosition = (props: Props) => props.size * 0.25

export const StyledCross = styled.div<Props>`
  position: relative;
  box-sizing: border-box;
  display: block;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 2px solid transparent;
  border-radius: ${({ size }) => size}px;
  transform: scale(var(--ggs, 1));
  ::after,
  ::before {
    position: absolute;
    top: ${getTopPosition}px;
    left: 1px;
    box-sizing: border-box;
    display: block;
    width: ${({ size }) => size}px;
    height: 1px;
    content: '';
    background: currentColor;
    border-radius: 5px;
    transform: rotate(45deg);
  }
  ::after {
    transform: rotate(-45deg);
  }
`
