import { RenameIcon } from '@violet/web/src/components/atoms/RenameIcon'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import type {
  BrowserDir,
  BrowserProject,
  BrowserRootDir,
  DirsDict,
  OperationData,
} from '@violet/web/src/types/browser'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ProjectNameUpdate } from '../ProjectNameUpdate'
import { DirectoryCell } from './DirectoryCell'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`

const Column = styled.div`
  display: flex;
  justify-content: end;
`

const SecondaryButton = styled.button`
  padding: 0.3em;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
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

const StyleRenameIcon = styled.i`
  opacity: 0.2;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
  }
`

const Message = styled.div`
  white-space: nowrap;
`

type Props = {
  operationData: OperationData
  project: BrowserProject
  dirs: BrowserDir[]
  dirsDict: DirsDict
}

export const Explorer = ({ operationData, project, dirs, dirsDict }: Props) => {
  const [openRename, setOpenRename] = useState(false)
  const rootDirs = useMemo(() => dirs.filter((d): d is BrowserRootDir => !d.parentDirId), [dirs])
  const rename = () => {
    setOpenRename(true)
  }
  const closeModal = () => {
    setOpenRename(false)
  }

  return (
    <Container>
      <ProjectArea>
        <ProjectName>{project.name}</ProjectName>
        <StyleRenameIcon onClick={rename}>
          <RenameIcon />
        </StyleRenameIcon>
      </ProjectArea>
      <CardModal onClose={closeModal} open={openRename}>
        <Spacer axis="y" size={8} />
        <Message>Enter a new project name</Message>
        <ProjectNameUpdate confirmName={closeModal} projectId={project.id} />
        <Spacer axis="y" size={8} />
        <Column>
          <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
        </Column>
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
