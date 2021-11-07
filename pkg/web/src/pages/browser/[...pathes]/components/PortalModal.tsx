import { Portal } from '@violet/web/src/components/atoms/Portal'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: ${colors.black}${alphaLevel[1]};
`

export const PortalModal = (props: { children: React.ReactNode }) => {
  return (
    <Portal>
      <Container>{props.children}</Container>
    </Portal>
  )
}
