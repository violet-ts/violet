import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  display: none;
`

const SelectLabel = styled.label`
  padding: 1px;
  color: #f3f3f3;
  background-color: #b9b9b9;
  cursor: pointer;
`

const StyleFileLabel = styled.input`
  width: 95px;
  height: 20px;
  background-color: #fff;
  border: 1px solid #999999;
  pointer-events: none;
`

const StyleInputFile = styled.div`
  display: flex;
  justify-content: center;
`

export const IconUpload = () => {
  const inputFileElement = useRef<HTMLInputElement>(null)
  const [filename, setFileName] = useState('')
  const inputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) return
    setFileName(e.target.files[0].name)
  }
  return (
    <StyleInputFile>
      <StyleFileLabel value={filename} readOnly />
      <SelectLabel>
        <Input type="file" ref={inputFileElement} onChange={inputFile} />
        Select
      </SelectLabel>
    </StyleInputFile>
  )
}
