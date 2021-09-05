import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  height: 100%;
`

const Header = styled.div`
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

export const Revision = () => {
  return (
    <Container>
      <Header></Header>
    </Container>
  )
}
