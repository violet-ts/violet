import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  min-height: 100%;
  background: ${colors.violet}${alphaLevel[2]};
  border-left: 1px solid ${colors.violet}${alphaLevel[3]};
`

export const StreamBar = () => {
  return <Container></Container>
}
