import styled from 'styled-components'
import { ApiTree } from '~/server/types'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  height: 100%;
  background: ${colors.violet}${alphaLevel[1]};
`

export const Explorer = (props: { tree: ApiTree }) => {
  return <Container />
}
