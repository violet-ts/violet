import { ConfigIcon } from '@violet/web/src/components/atoms/ConfigIcon'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import type {
  BrowserDir,
  BrowserProject,
  BrowserRootDir,
  DirsDict,
  OperationData,
} from '@violet/web/src/types/browser'
import { fontSizes } from '@violet/web/src/utils/constants'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ProjectConfig } from '../ProjectConfig'
import { DirectoryCell } from './DirectoryCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`

const ProjectName = styled.div`
  padding: 12px;
  font-size: ${fontSizes.medium};
  font-weight: bold;
`

const TreeViewer = styled.div`
  flex: 1;
  overflow: auto;
`

const ProjectArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const StyleIcon = styled.i`
  display: flex;
  align-items: center;
  opacity: 0.2;
  transition: opacity 0.5s;

  &:hover {
    opacity: 1;
  }
`

type Props = {
  operationData: OperationData
  project: BrowserProject
  dirs: BrowserDir[]
  dirsDict: DirsDict
}

export const Explorer = ({ operationData, project, dirs, dirsDict }: Props) => {
  const [openConfiguration, setOpenConfiguration] = useState(false)
  const rootDirs = useMemo(() => dirs.filter((d): d is BrowserRootDir => !d.parentDirId), [dirs])
  const closeModal = () => {
    setOpenConfiguration(false)
  }

  const openConfigModal = () => {
    setOpenConfiguration(true)
  }

  return (
    <Container>
      <ProjectArea>
        <ProjectName>{project.name}</ProjectName>
        <StyleIcon onClick={openConfigModal}>
          <ConfigIcon size={22} />
        </StyleIcon>
      </ProjectArea>
      <CardModal onClose={closeModal} open={openConfiguration}>
        <ProjectConfig project={project} onComplete={closeModal} />
      </CardModal>
      <TreeViewer>
        {rootDirs.map((rootDir) => (
          <DirectoryCell
            key={rootDir.id}
            dirs={dirs}
            dir={rootDir}
            project={project}
            dirsDict={dirsDict}
            operationData={operationData}
          />
        ))}
      </TreeViewer>
    </Container>
  )
}
