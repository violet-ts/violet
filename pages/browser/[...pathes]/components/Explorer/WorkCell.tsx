import type { BrowserWork } from '~/server/types'
import { getWorkFullName } from '~/utils'
import { CellName } from './CellName'

export const WorkCell = (props: { work: BrowserWork }) => {
  return (
    <CellName
      isWork
      fullPath={props.work.fullPath}
      selected={props.work.selected}
      name={getWorkFullName(props.work)}
    />
  )
}
