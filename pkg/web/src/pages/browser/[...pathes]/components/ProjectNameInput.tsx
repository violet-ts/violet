import { Loading } from '@violet/web/src/components/atoms/Loading'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import { useRouter } from 'next/dist/client/router'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  display: flex;
  justify-content: center;
`

export const ProjectNameInput = (props: { onComplete?: () => void }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const { asPath, push } = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])
  const createProject = async (name: string) => {
    const newProject = await api.browser.projects.post({ body: { name } }).catch(onErr)
    if (!newProject?.body) return

    const projectsData = [...apiWholeData.projects, newProject.body]
    const projectsStatus = [
      ...projects,
      {
        id: newProject.body.id,
        name: newProject.body.name,
        openedFullPathDict: {},
        openedTabId: undefined,
        selectedFullPath: newProject.body.id,
        tabs: [],
      },
    ]
    updateApiWholeData('projects', projectsData)
    updateProjects(projectsStatus)
    push(`${asPath}/${newProject.body.id}`)
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
