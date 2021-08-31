import styled from 'styled-components'
import { alphaList, colors } from '~/utils/constants'

const Container = styled.div`
  height: 100%;
  background: ${colors.violet}${alphaList[1]};
`

export const Explorer = () => {
  return <Container />
}
