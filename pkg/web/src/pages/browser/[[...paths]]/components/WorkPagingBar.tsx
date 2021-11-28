import { fileTypes } from '@violet/def/constants'
import { AddButton } from '@violet/web/src/components/atoms/AddButton'
import { ChevronUp } from '@violet/web/src/components/atoms/Chevron'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
`
const ButtonWrap = styled.div`
  text-align: inherit;
`

const ChevronDown = styled.div`
  text-align: inherit;
  transform: rotate(180deg);
`
export const WorkPagingBar = () => {
  const sendFormData = (file: File) => {
    return file
  }
  const setOpenAlert = (isOpen: boolean) => {
    return isOpen
  }
  const dropFile = (file: File) => {
    fileTypes.some((f) => file.type === f.type) ? void sendFormData(file) : setOpenAlert(true)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) {
      dropFile(e.target.files[0])
    }
    e.target.value = ''
  }

  return (
    <Container>
      <ButtonWrap onChange={onChange}>
        <ChevronUp />
      </ButtonWrap>
      <Spacer axis="y" size={160} />
      <ChevronDown onChange={onChange}>
        <ChevronUp />
      </ChevronDown>
      <Spacer axis="y" size={160} />
      <ButtonWrap onChange={onChange}>
        <AddButton />
      </ButtonWrap>
    </Container>
  )
}
