import { acceptImageExtensions } from '@violet/def/constants'
import type { ApiProject } from '@violet/lib/types/api'
import { ImageIcon } from '@violet/web/src/components/atoms/ImageIcon'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import type { ChangeEvent, Dispatch } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: left;
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

const IconImage = styled.img`
  margin: 4px;
  width: 28px;
  height: 28px;
  border-radius: 6px;
`

export const IconUpload = (props: {
  projectName: ApiProject['name']
  setIconImageFile: Dispatch<File | null>
}) => {
  const inputImageElement = useRef<HTMLInputElement>(null)
  const [iconImageUrl, setIconImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const loadImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return

    setIsLoading(true)
    const imageFile = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = () => {
      setIconImageUrl(reader.result as string)
    }
    props.setIconImageFile(imageFile)
    setIsLoading(false)
  }

  return (
    <Container>
      {isLoading && <Loading />}
      {iconImageUrl ? (
        <IconImage src={iconImageUrl} />
      ) : (
        <IconWrapper>
          <Icon>{props.projectName.slice(0, 2)}</Icon>
        </IconWrapper>
      )}
      <Spacer axis="x" size={10} />
      <StyleImageIcon>
        <ImageIcon />
        <StyleInput
          type="file"
          accept={acceptImageExtensions}
          ref={inputImageElement}
          onChange={loadImageFile}
        />
      </StyleImageIcon>
    </Container>
  )
}
