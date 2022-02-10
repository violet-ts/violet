import type { ApiProject } from '@violet/lib/types/api'
import type { DirsDict, OperationData, WorksDict } from '@violet/web/src/types/browser'
import { createPath } from '@violet/web/src/utils'
import { alphaLevel, colors } from '@violet/web/src/utils/constants'
import Link from 'next/link'
import { useMemo } from 'react'
import styled from 'styled-components'
import { FontStyle } from '../Styles/PartsStyles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow: overlay;
`

const Label = styled.div`
  padding: 8px;
  ${FontStyle}
`

const PartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
`

const DirFrame = styled.button`
  width: fit-content;
  padding: 8px;
  cursor: pointer;
  background-color: ${colors.white};
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  border-radius: 4px;
  ${FontStyle}
`
const WorkFrame = styled.button`
  width: 24%;
  max-width: 300px;
  padding: 8px;
  cursor: pointer;
  background-color: ${colors.white};
  border: 1px solid ${colors.violet}${alphaLevel[2]};
  border-radius: 4px;
  ${FontStyle}
`

const EmptyMessage = styled.div`
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
  const displayedDirs = useMemo(
    () =>
      Object.values(dirsDict)
        .map((dir) => dir.parentDirId !== null && dir.parentDirId === operationData.activeTab?.id)
        .includes(true),
    [operationData, dirsDict]
  )

  const displayedWorks = useMemo(() => {
    if (operationData.activeTab && operationData.activeTab.type === 'dir') {
      return dirsDict[operationData.activeTab.id].works
    }
    return null
  }, [operationData, dirsDict])

  const childrenDir = useMemo(
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
      {displayedDirs && (
        <>
          <Label>Directlies</Label>
          <PartsContainer>
            {childrenDir.map((dir) => (
              <Link
                key={dir.id}
                href={createPath(dir.id, undefined, project, dirsDict, worksDict)}
                passHref
              >
                <DirFrame>{dir.name}</DirFrame>
              </Link>
            ))}
          </PartsContainer>
        </>
      )}
      {displayedWorks !== null ? (
        <>
          <Label>Works</Label>
          <PartsContainer>
            {displayedWorks?.map((work) => (
              <Link
                key={work.id}
                href={createPath(work.dirId, work.id, project, dirsDict, worksDict)}
                passHref
              >
                <WorkFrame>
                  {work.latestRevisionId === null ? <div>No Revision</div> : <div>{work.name}</div>}
                </WorkFrame>
              </Link>
            ))}
          </PartsContainer>
        </>
      ) : (
        <EmptyMessage>Directly and Works has not been , yet.</EmptyMessage>
      )}
    </Container>
  )
}
