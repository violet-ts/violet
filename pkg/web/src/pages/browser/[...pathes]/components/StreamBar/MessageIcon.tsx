import React from 'react'
import styled from 'styled-components'

const ClickableArea = styled.button`
  width: 24px;
  height: 32px;
  cursor: pointer;
  background-color: transparent;
  border: none;
`
const SubmitIcon = styled.div`
  position: relative;
  width: 16px;
  height: 4px;
  border-right: solid transparent;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  box-shadow: 0 0 0 2px, inset -2px 0 0;
  transform: rotate(-45deg);
  ::before {
    position: absolute;
    top: -2px;
    left: -12px;
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
export const MessageIcon = (props: { onClick: () => void }) => {
  return (
    <ClickableArea onClick={props.onClick}>
      <SubmitIcon />
    </ClickableArea>
  )
}
