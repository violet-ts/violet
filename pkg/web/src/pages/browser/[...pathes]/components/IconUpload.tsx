import { acceptImageExtensions } from '@violet/def/constants'
import { ProjectId } from '@violet/lib/types/branded'
import { ImageIcon } from '@violet/web/src/components/atoms/ImageIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { useApi } from '@violet/web/src/hooks'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
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

export const IconUpload = (props: { projectName: string; projectId: ProjectId }) => {
  const { api, onErr } = useApi()
  const inputImageElement = useRef<HTMLInputElement>(null)
  const [imageFileName, setImageFileName] = useState('')
  const [iconImageUrl, setIconImageUrl] = useState('')

  const inputImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return
    const response = await api.browser.projects
      ._projectId(props.projectId)
      .post({ body: { imageFile: e.target.files[0] } })
      .catch(onErr)
  }
  return (
    <Container>
      {iconImageUrl ? (
        <img src={iconImageUrl} />
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
          onChange={inputImageFile}
        />
      </StyleImageIcon>
    </Container>
  )
}
