import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  min-height: 100%;
  border-left: 1px solid ${colors.violet}${alphaLevel[2]};
`

export const StreamBar = () => {
  return <Container></Container>
}
