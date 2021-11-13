import { RenameIcon } from 'src/components/atoms/RenameIcon'
import styled from 'styled-components'

const StyleRenameIcon = styled.i`
  opacity: 0.2;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
  }
`

export const EditProjectName = (props: { onClick: () => void }) => {
  return (
    <StyleRenameIcon onClick={props.onClick}>
      <RenameIcon />
    </StyleRenameIcon>
  )
}
