import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  height: 40px;
  background: ${colors.violet}${alphaLevel[1]};
`

export const WorkTabBar = () => {
  return <Container />
}
