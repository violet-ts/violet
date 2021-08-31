import styled from 'styled-components'
import { alphaList, colors } from '~/utils/constants'

const Container = styled.div`
  height: 40px;
  background: ${colors.violet}${alphaList[1]};
`

export const WorkTabBar = () => {
  return <Container />
}
