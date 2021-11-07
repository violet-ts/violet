import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.div`
  position: relative;
  top: 80px;
  display: flex;
  justify-content: center;
`

export const InputFromProject = (props: { closeModal: () => void }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputElement.current?.focus()
  }, [inputElement.current])
  const sendProjectName = (e: FormEvent) => {
    e.preventDefault()
    if (label) {
    }
    setLabel('')
    props.closeModal()
  }
  return (
    <InputFormProject>
      <form onSubmit={sendProjectName}>
        <input ref={inputElement} type="text" onBlur={sendProjectName} onChange={inputLabel} />
      </form>
    </InputFormProject>
  )
}
