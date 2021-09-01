import { getWorkFullName } from '~/utils'
import type { WorkData } from './'
import { CellName } from './CellName'

export const WorkCell = (props: {
  work: WorkData
  onClickCellName: (fullPath: string) => void
}) => {
  return (
    <CellName
      isWork
      depth={props.work.depth}
      selected={props.work.selected}
      name={getWorkFullName(props.work)}
      onClick={() => props.onClickCellName(props.work.fullPath)}
    />
  )
}
