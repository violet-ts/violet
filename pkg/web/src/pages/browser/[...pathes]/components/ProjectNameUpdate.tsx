import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { BrowserContext } from '@violet/web/src/contexts/Browser'
import { useApi } from '@violet/web/src/hooks'
import type { ChangeEvent, Dispatch, FormEvent } from 'react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  text-align: left;
`

export const ProjectNameUpdate = (props: {
  confirmName: () => void
  projectId: ProjectId
  setNewProjectName: Dispatch<string>
}) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value), props.setNewProjectName(e.target.value)
  }, [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const [isUpdating, setIsUpdating] = useState(false)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateProjectName = async (name: string) => {
    const projectData = await api.browser.projects
      ._projectId(props.projectId)
      .put({ body: { projectName: name } })
      .catch(onErr)
    if (!projectData) return

    const projectsData = apiWholeData.projects.map((d) =>
      d.id === props.projectId ? projectData.body : d
    )
    const projectsStatus = projects.map((d) =>
      d.id === props.projectId ? { ...d, name: projectData.body.name } : d
    )
    updateApiWholeData('projects', projectsData)
    updateProjects(projectsStatus)
  }

  const updateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsUpdating(true)
    await updateProjectName(label)
    setIsUpdating(false)
    props.confirmName()
  }
  return (
    <InputFormProject onSubmit={updateName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isUpdating && <Loading />}
    </InputFormProject>
  )
}
