import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import styled from 'styled-components'
import { Portal } from './Portal'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${colors.black}${alphaLevel[8]};
`

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 10px;
  text-indent: -9999em;
  border-top: 1.1em solid rgb(255 255 255 / 20%);
  border-right: 1.1em solid rgb(255 255 255 / 20%);
  border-bottom: 1.1em solid rgb(255 255 255 / 20%);
  border-left: 1.1em solid #fff;
  animation: load 1.1s infinite linear;

  &,
  ::after {
    width: 10em;
    height: 10em;
    border-radius: 50%;
  }

  @keyframes load {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes load {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`

export const Loading = () => {
  return (
    <Portal>
      <Container>
        <Loader />
      </Container>
    </Portal>
  )
}
