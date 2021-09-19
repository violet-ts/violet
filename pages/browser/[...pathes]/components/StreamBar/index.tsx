import styled from 'styled-components'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border-left: 1px solid ${colors.violet}${alphaLevel[2]};
`
const StreamBox = styled.div`
  flex: 1;
  height: 100%;
`
const MessageBox = styled.div`
  padding: 8px;
`
const InputForm = styled.input`
  width: 100%;
  height: 80px;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  ::placeholder {
    color: ${colors.violet}${alphaLevel[2]};
  }
`
const SubmitIcon = styled.button`
  position: fixed;
  right: 16px;
  bottom: 24px;
  width: 16px;
  height: 4px;
  margin-right: -2px;
  border-right: 2px solid transparent;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  box-shadow: 0 0 0 2px, inset -2px 0 0;
  transform: rotate(-45deg) scale(var(--ggs, 1));
  ::before {
    position: absolute;
    top: -4px;
    left: -14px;
    box-sizing: border-box;
    display: block;
    width: 8px;
    height: 8px;
    content: '';
    border-top: 4px solid transparent;
    border-right: 8px solid;
    border-bottom: 4px solid transparent;
  }
`
export const StreamBar = () => {
  return (
    <Container>
      <StreamBox />
      <MessageBox>
        <InputForm placeholder="message" type="text" />
        <SubmitIcon />
      </MessageBox>
    </Container>
  )
}
