import type { ProjectId } from '@violet/lib/types/branded'
import { Loading } from '@violet/web/src/components/atoms/Loading'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { useBrowserContext } from '@violet/web/src/contexts/Browser'
import { pagesPath } from '@violet/web/src/utils/$path'
import { useRouter } from 'next/router'
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
  const { projects, updateProject } = useBrowserContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const { push, asPath } = useRouter()
  const projectUrlArray = asPath.split('/')
  const iconName =
    projects
      .find((d) => d.id === projectId)
      ?.iconUrl?.split('/')
      .slice(-1)[0] ?? null
  useEffect(() => {
    inputElement.current?.focus()
  }, [])

  const updateName = async (e: FormEvent) => {
    e.preventDefault()
    if (!label) return

    setIsUpdating(true)
    const projectRes = await api.browser.projects
      ._projectId(projectId)
      .$put({ body: { name: label, iconName } })
      .catch(onErr)
    setIsUpdating(false)
    onConfirmName?.()
    if (projectRes) {
      updateProject(projectRes)
      await push(pagesPath.browser._paths([label, ...projectUrlArray.slice(3)]).$url())
    }
  }

  return (
    <InputFormProject onSubmit={updateName}>
      <input ref={inputElement} type="text" onChange={inputLabel} />
      {isUpdating && <Loading />}
    </InputFormProject>
  )
}
