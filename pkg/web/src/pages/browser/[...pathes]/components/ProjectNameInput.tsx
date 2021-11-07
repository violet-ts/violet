import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.div`
  position: relative;
  top: 80px;
  display: flex;
  justify-content: center;
`

export const ProjectNameInput = (props: { closeModal: () => void }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])
  const sendProjectName = (e: FormEvent) => {
    e.preventDefault()
    if (label) {
      setLabel(label)
    }
    setLabel('')
    props.closeModal()
  }
  return (
    <InputFormProject>
      <form onSubmit={sendProjectName}>
        <input ref={inputElement} type="text" onChange={inputLabel} />
      </form>
    </InputFormProject>
  )
}
