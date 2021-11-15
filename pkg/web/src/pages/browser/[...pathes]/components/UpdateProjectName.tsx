import type { ProjectId } from '@violet/api/types'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  text-align: center;
`

export const UpdateProjectName = (props: { confirmName: () => void; projectId: ProjectId }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateProcess = async (name: string) => {
    const updateProject = await api.browser.projects
      ._projectId(props.projectId)
      .put({ body: { name } })
      .catch(onErr)
    if (!updateProject) return

    const projectsData = apiWholeData.projects.map((d) =>
      d.id === props.projectId ? updateProject.body : d
    )
    const projectsStatus = projects.map((d) =>
      d.id === props.projectId ? { ...d, name: updateProject.body.name } : d
    )
    updateApiWholeData('projects', projectsData)
    updateProjects(projectsStatus)
  }

  const updateProjectName = (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    updateProcess(label)
    props.confirmName()
  }
  return (
    <InputFormProject onSubmit={updateProjectName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
    </InputFormProject>
  )
}
