import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React from 'react'
import styled from 'styled-components'

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledData = styled.i`
  color: ${colors.gray};
  transform: scale(var(--ggs, 1));
  &,
  ::after,
  ::before {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 14px;
    height: 14px;
    border: 2px solid;
    border-radius: 50%;
  }
  ::after,
  ::before {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 6px;
    height: 6px;
    content: '';
  }
  ::after {
    top: -6px;
    left: -6px;
    width: 22px;
    height: 22px;
    background: linear-gradient(to left, currentColor 8px, transparent 0) no-repeat bottom
      center/2px 8px;
  }
  &,
  ::after {
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
`
const Character = styled.div`
  font-size: ${fontSizes.large};
  line-height: 48px;
  color: ${colors.gray};
`
export const DataConvert = () => {
  return (
    <IconContainer>
      <StyledData />
      <Character>CONVERTING...</Character>
    </IconContainer>
  )
}
