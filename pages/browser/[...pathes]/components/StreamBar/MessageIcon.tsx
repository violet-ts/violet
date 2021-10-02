import React from 'react'
import styled from 'styled-components'

const ClickableArea = styled.button`
  width: 32px;
  height: 32px;
  margin-top: 32px;
  background-color: transparent;
  border: none;
`
const SubmitIcon = styled.button`
  width: 16px;
  height: 4px;
  border-right: solid transparent;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  box-shadow: 0 0 0 2px, inset -2px 0 0;
  transform: rotate(-45deg);
  ::after {
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
export const ArrowTopLeftO = (props: { click: () => void }) => {
  return (
    <div>
      <ClickableArea type="submit" onClick={() => props.click()}>
        <SubmitIcon />
      </ClickableArea>
    </div>
  )
}
