import { Loading } from '@violet/web/src/components/atoms/Loading'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { useRouter } from 'next/dist/client/router'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  display: flex;
  justify-content: center;
`

export const ProjectNameInput = (props: { onComplete?: () => void }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApiContext()
  const { updateProject } = useBrowserContext()
  const { asPath, push } = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])
  const createProject = async (name: string) => {
    const newProject = await api.browser.projects.$post({ body: { name } }).catch(onErr)
    if (!newProject) return

    updateProject(newProject)
    await push(`${asPath}/${newProject.id}`)
  }
  const sendProjectName = async (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsCreating(true)
    await createProject(label)
    setIsCreating(false)
    setLabel('')
    props.onComplete?.()
  }

  return (
    <InputFormProject onSubmit={sendProjectName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isCreating && <Loading />}
    </InputFormProject>
  )
}
