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

export const ProjectNameInput = (props: { closeModal: () => void }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const { replace } = useRouter()
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
    updateProjects(
      projectsStatus.map((d) => ({
        ...d,
        tabs: d.tabs,
        openedFullPathDict: d.openedFullPathDict,
        openedTabId: d.openedTabId,
        selectedFullPath: d.id,
      }))
    )
    replace(newProject.body.id)
  }
  const sendProjectName = (e: FormEvent) => {
    e.preventDefault()
    if (!label) return
    createProject(label)
    setLabel('')
    props.closeModal()
  }
  return (
    <InputFormProject onSubmit={sendProjectName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
    </InputFormProject>
  )
}
