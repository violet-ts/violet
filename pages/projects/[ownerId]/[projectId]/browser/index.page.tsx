import styled from 'styled-components'
import { Explorer } from './components/Explorer'
import { LeftColumn } from './components/LeftColumn'
import { WorkTabBar } from './components/WorkTabBar'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
`

const MainColumn = styled.div`
  flex: 1;
  height: 100%;
`

const BrowserPage = () => {
  return (
    <Container>
      <LeftColumn>
        <Explorer />
      </LeftColumn>
      <MainColumn>
        <WorkTabBar />
      </MainColumn>
    </Container>
  )
}

export default BrowserPage
