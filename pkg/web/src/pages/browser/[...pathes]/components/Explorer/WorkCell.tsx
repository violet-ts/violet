import type { BrowserWork } from '@violet/web/src/types/browser'
import { getWorkFullName } from '@violet/web/src/utils'
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
