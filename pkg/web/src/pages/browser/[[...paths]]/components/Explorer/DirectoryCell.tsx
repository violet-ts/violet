import type {
  BrowserDir,
  BrowserProject,
  DirsDict,
  OperationData,
} from '@violet/web/src/types/browser'
import { CellName } from './CellName'

export const DirectoryCell = (props: {
  project: BrowserProject
  dirsDict: DirsDict
  dirs: BrowserDir[]
  dir: BrowserDir
  operationData: OperationData
}) => {
  return (
    <>
      <CellName
        project={props.project}
        dirsDict={props.dirsDict}
        dir={props.dir}
        active={props.operationData.activeTab?.id === props.dir.id}
        opened={props.operationData.openedDirDict[props.dir.id]}
      />
      {props.operationData.openedDirDict[props.dir.id] && (
        <>
          {props.dirs
            .filter((d) => d.parentDirId === props.dir.id)
            .map((d) => (
              <DirectoryCell
                key={d.id}
                dirs={props.dirs}
                dir={d}
                project={props.project}
                dirsDict={props.dirsDict}
                operationData={props.operationData}
              />
            ))}
          {props.dir.works.map((w) => (
            <CellName
              key={w.id}
              project={props.project}
              dirsDict={props.dirsDict}
              dir={props.dir}
              work={w}
              active={props.operationData.activeTab?.id === w.id}
            />
          ))}
        </>
      )}
    </>
  )
}
