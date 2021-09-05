import type { BrowserDir } from '~/server/types'
import { CellName } from './CellName'
import { WorkCell } from './WorkCell'

export const DirectoryCell = ({ dir }: { dir: BrowserDir }) => {
  return (
    <div>
      <CellName
        fullPath={dir.fullPath}
        selected={dir.selected}
        opened={dir.opened}
        name={dir.name}
      />
      {dir.opened &&
        dir.children.map((d, i) =>
          d.type === 'dir' ? <DirectoryCell key={i} dir={d} /> : <WorkCell key={i} work={d} />
        )}
    </div>
  )
}
