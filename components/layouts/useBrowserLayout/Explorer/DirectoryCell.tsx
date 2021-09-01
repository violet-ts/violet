import { CellName } from './CellName'
import type { DirData, WorkData } from './types'
import { WorkCell } from './WorkCell'

export const DirectoryCell = ({
  dir,
  onClickCellName,
}: {
  dir: DirData
  onClickCellName: (data: DirData | WorkData) => void
}) => {
  return (
    <div>
      <CellName
        fullPath={dir.fullPath}
        selected={dir.selected}
        opened={dir.opened}
        name={dir.name}
        onClick={() => onClickCellName(dir)}
      />
      {dir.opened &&
        dir.children.map((d, i) =>
          d.type === 'dir' ? (
            <DirectoryCell key={i} dir={d} onClickCellName={onClickCellName} />
          ) : (
            <WorkCell key={i} work={d} onClickCellName={onClickCellName} />
          )
        )}
    </div>
  )
}
