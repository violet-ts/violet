import type { ApiProject } from '@violet/lib/types/api'
import type { DirsDict, OperationData, WorksDict } from '@violet/web/src/types/browser'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import { useCallback } from 'react'
import styled from 'styled-components'
import { createPath } from '../../../../../utils'
import { FontStyle } from '../Styles/PartsStyles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  overflow: overlay;
`

const Label = styled.div`
  padding: 8px;
  ${FontStyle}
`

const DirContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
`

const DirsFrame = styled.button`
  width: fit-content;
  padding: 8px;
  cursor: pointer;
  background-color: ${colors.white};
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  border-radius: 4px;
  ${FontStyle}
`

const Message = styled.div`
  width: fit-content;
  padding: 8px;
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  border-radius: 4px;
  ${FontStyle}
`

type ComponentProps = {
  project: ApiProject
  operationData: OperationData
  dirsDict: DirsDict
  worksDict: WorksDict
}

export const DirTab = ({ project, operationData, dirsDict, worksDict }: ComponentProps) => {
  const displayedDirs = useCallback(
    () =>
      Object.values(dirsDict)
        .map((dir) => dir.parentDirId !== null && dir.parentDirId === operationData.activeTab?.id)
        .includes(true),
    [operationData, dirsDict]
  )

  const displayedWorks = useCallback(
    () =>
      operationData.activeTab &&
      operationData.activeTab.type === 'dir' &&
      dirsDict[operationData.activeTab.id].works.length > 0,
    [operationData, dirsDict]
  )

  const childrenDir = useCallback(
    () =>
      Object.values(dirsDict).filter(
        (dir) =>
          operationData.activeTab?.type === 'dir' &&
          dir.parentDirId === dirsDict[operationData.activeTab.id].id
      ),
    [operationData, dirsDict]
  )

  return (
    <Container>
      {displayedDirs() && (
        <>
          <Label>Directlies</Label>
          <DirContainer>
            {childrenDir().map((dir) => (
              <Link
                key={dir.id}
                href={createPath(dir.id, undefined, project, dirsDict, worksDict)}
                passHref
              >
                <DirsFrame>{dir.name} </DirsFrame>
              </Link>
            ))}
          </DirContainer>
        </>
      )}
      {displayedWorks() ? (
        <Label>Works</Label>
      ) : (
        <Message>Directly and Works has not been, yet. </Message>
      )}
    </Container>
  )
}
