import type { DirData } from './'
import { CellName } from './CellName'
import { WorkCell } from './WorkCell'

export const DirectoryCell = ({
  dir,
  onClickCellName,
}: {
  dir: DirData
  onClickCellName: (fullPath: string) => void
}) => {
  return (
    <div>
      <CellName
        depth={dir.depth}
        selected={dir.selected}
        opened={dir.opened}
        name={dir.name}
        onClick={() => onClickCellName(dir.fullPath)}
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
