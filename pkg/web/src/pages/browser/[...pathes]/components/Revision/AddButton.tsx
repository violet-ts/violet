import React from 'react'
import styled from 'styled-components'
import { acceptExtensions } from '~/server/utils/constants'
import { alphaLevel, colors } from '~/utils/constants'

const Container = styled.div`
  height: 100%;
`

const StyledAddButton = styled.label`
  position: relative;
  box-sizing: border-box;
  display: block;
  width: 48px;
  height: 48px;
  color: ${colors.violet};
  cursor: pointer;
  background-color: ${colors.violet}${alphaLevel[2]};
  border: 2px solid;
  border-radius: 4px;
  transform: scale(var(--ggs, 1));
  ::after,
  ::before {
    position: absolute;
    top: 20px;
    left: 10px;
    box-sizing: border-box;
    display: block;
    width: 24px;
    height: 4px;
    color: ${colors.violet};
    content: '';
    background: currentColor;
    border-radius: 5px;
  }
  ::after {
    top: 10px;
    left: 20px;
    width: 4px;
    height: 24px;
    color: ${colors.violet};
  }
`
const UploadFile = styled.input`
  display: none;
`
export const AddButton = (props: { dropFile: (file: File) => void }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      props.dropFile(e.target.files[0])
    }
    e.target.value = ''
  }
  return (
    <Container>
      <StyledAddButton>
        <UploadFile type="file" accept={acceptExtensions} onChange={onChange} />
      </StyledAddButton>
    </Container>
  )
}
