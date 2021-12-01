import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import type { ChangeEvent, Dispatch, FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const InputFormProject = styled.form`
  text-align: left;
`

interface Props {
  onConfirmName?: () => void
  projectId: ProjectId
  setNewProjectName: Dispatch<string>
}

export const ProjectNameUpdate: React.FC<Props> = ({
  onConfirmName,
  projectId,
  setNewProjectName,
}: Props) => {
  const [label, setLabel] = useState('')
  const inputLabel = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLabel(e.target.value)
      setNewProjectName(e.target.value)
    },
    [setNewProjectName]
  )
  const inputElement = useRef<HTMLInputElement>(null)
  const { api, onErr } = useApiContext()
  const { updateProject } = useBrowserContext()
  const [isUpdating, setIsUpdating] = useState(false)
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateProjectName = async (name: string) => {
    const projectRes = await api.browser.projects
      ._projectId(projectId)
      .$put({ body: { name } })
      .catch(onErr)

    if (projectRes) updateProject(projectRes)
  }

  const updateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsUpdating(true)
    await updateProjectName(label)
    setIsUpdating(false)
    onConfirmName?.()
  }
  return (
    <InputFormProject onSubmit={updateName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isUpdating && <Loading />}
    </InputFormProject>
  )
}
