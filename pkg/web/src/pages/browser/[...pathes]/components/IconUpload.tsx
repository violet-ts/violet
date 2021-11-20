import { colors, fontSizes } from '@violet/web/src/utils/constants'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { ImageIcon } from 'src/components/atoms/ImageIcon'
import { Spacer } from 'src/components/atoms/Spacer'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyleInput = styled.input`
  display: none;
`

const StyleImageIcon = styled.label`
  opacity: 0.2;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
  }
`

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: ${fontSizes.small};
  font-weight: bold;
  color: ${colors.white};
  background: ${colors.blue};
  border-radius: 6px;
`

const IconWrapper = styled.div`
  display: inline-block;
  width: 36px;
  height: 36px;
  padding: 2px;
  cursor: default;
  border-radius: 8px;
  transition: border-color 0.2s;
`

export const IconUpload = (props: { projectName: string }) => {
  const inputImageElement = useRef<HTMLInputElement>(null)
  const inputImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return
  }
  return (
    <Container>
      <IconWrapper>
        <Icon>{props.projectName.slice(0, 2)}</Icon>
      </IconWrapper>
      <Spacer axis="x" size={10} />
      <StyleImageIcon>
        <ImageIcon />
        <StyleInput type="file" ref={inputImageElement} onChange={inputImageFile} />
      </StyleImageIcon>
    </Container>
  )
}
