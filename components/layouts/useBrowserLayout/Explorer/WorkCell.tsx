import { getWorkFullName } from '~/utils'
import { CellName } from './CellName'
import type { DirData, WorkData } from './types'

export const WorkCell = (props: {
  work: WorkData
  onClickCellName: (data: DirData | WorkData) => void
}) => {
  return (
    <CellName
      isWork
      fullPath={props.work.fullPath}
      selected={props.work.selected}
      name={getWorkFullName(props.work)}
      onClick={() => props.onClickCellName(props.work)}
    />
  )
}
