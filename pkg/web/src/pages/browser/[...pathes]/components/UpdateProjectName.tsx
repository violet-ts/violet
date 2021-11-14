import type { ProjectId } from '@violet/api/types'
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

export const UpdateProjectName = (props: { confirmName: () => void; projectId: ProjectId }) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApi()
  const { apiWholeData, projects, updateApiWholeData, updateProjects } = useContext(BrowserContext)
  const [isUpdating, setIsUpdating] = useState(false)
  const { asPath, push } = useRouter()
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateProcess = async (name: string) => {
    const updateProject = await api.browser.projects
      ._projectId(props.projectId)
      .put({ body: { name } })
      .catch(onErr)
    if (!updateProject?.body) return

    const projectsData = apiWholeData.projects.map((d) =>
      d.id === props.projectId ? updateProject.body : d
    )
    const projectsStatus = [
      projects.map((d) =>
        d.id === props.projectId
          ? {
              id: d.id,
              name: updateProject.body.name,
              openedFullPathDict: d.openedFullPathDict,
              openedTabId: d.openedTabId,
              selectedFullPath: d.selectedFullPath,
              tabs: d.tabs,
            }
          : d
      ),
    ][0]
    updateApiWholeData('projects', projectsData)
    updateProjects(projectsStatus)
  }

  const updateProjectName = (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsUpdating(true)
    updateProcess(label)
    setIsUpdating(false)
    props.confirmName()
  }
  return (
    <InputFormProject onSubmit={updateProjectName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isUpdating && <Loading />}
    </InputFormProject>
  )
}
