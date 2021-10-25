import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { colors, fontSizes } from '~/utils/constants'
import { AddButton } from './AddButton'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const DisplayWorksArea = styled.div`
  top: 0;
  left: 0;
  flex: 1;
  padding: 48px;
  background: ${colors.transparent};
  transition: background 0.2s, padding 0.2s;
`

const DisplayWorksFrame = styled.div`
  display: flex;
  flex: 1;
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
      <DisplayWorksArea>
        <DisplayWorksFrame>SHOW WORK</DisplayWorksFrame>
      </DisplayWorksArea>
      <div>
        <AddButton />
      </div>
      <Spacer axis="y" size={16} />
    </Container>
  )
}
