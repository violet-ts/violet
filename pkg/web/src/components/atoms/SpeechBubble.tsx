import styled from 'styled-components'

export const SpeechBubble = styled.div`
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  display: inline-block;
  min-width: 120px;
  max-width: 100%;
  padding: 7px 10px;
  margin: 1.5em 0;
  font-size: 16px;
  color: #555;
  background: #fff;
  border: solid 3px #555;

  ::before {
    position: absolute;
    top: -24px;
    left: 25%;
    z-index: 2;
    margin-left: -15px;
    content: '';
    border: 12px solid transparent;
    border-bottom: 12px solid #fff;
  }

  ::after {
    position: absolute;
    top: -30px;
    left: 25%;
    z-index: 1;
    margin-left: -17px;
    content: '';
    border: 14px solid transparent;
    border-bottom: 14px solid #555;
  }
`
