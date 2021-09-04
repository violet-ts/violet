import type { BrowserDir, BrowserWork } from '~/server/types'
import { CellName } from './CellName'
import { WorkCell } from './WorkCell'

export const DirectoryCell = ({
  dir,
  onClickCellName,
}: {
  dir: BrowserDir
  onClickCellName: (data: BrowserDir | BrowserWork) => void
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
