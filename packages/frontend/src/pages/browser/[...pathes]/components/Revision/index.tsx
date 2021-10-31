import styled from 'styled-components'
import { alphaLevel, colors, fontSizes } from '@violet/frontend/src/utils/constants'

const Container = styled.div`
  position: relative;
  height: 100%;
`

const Header = styled.div`
  border-bottom: 1px solid ${colors.violet}${alphaLevel[2]};
`

const DisplayWorksArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 160px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${fontSizes.big};
  color: ${colors.violet};
  border: 4px solid ${colors.violet};
  border-radius: 24px;
`

export const Revision = () => {
  return (
    <Container>
      <Header></Header>
      <DisplayWorksArea>
        <DisplayWorksFrame>SHOW WORK</DisplayWorksFrame>
      </DisplayWorksArea>
    </Container>
  )
}
