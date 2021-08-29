import styled from 'styled-components'

type Props = { axis: 'x' | 'y'; size: number }

const getHeight = ({ axis, size }: Props) => (axis === 'x' ? 1 : size)
const getWidth = ({ axis, size }: Props) => (axis === 'y' ? 1 : size)

export const Spacer = styled.span<Props>`
  display: ${({ axis }) => (axis === 'x' ? 'inline-' : '')}block;
  width: ${getWidth}px;
  min-width: ${getWidth}px;
  height: ${getHeight}px;
  min-height: ${getHeight}px;
`
