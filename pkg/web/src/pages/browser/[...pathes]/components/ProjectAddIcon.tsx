import styled from 'styled-components'
const AddProjectButton = styled.i`
  & {
    position: relative;
    box-sizing: border-box;
    display: block;
    width: 28px;
    height: 28px;
    margin: 3px;
    color: black;
    background-color: gray;
    border: 2px solid;
    border-color: gray;
    border-radius: 4px;
    opacity: 0.4;
    transition: opacity 0.5s;
    transform: scale(var(--ggs, 1));
  }
  &::after,
  &::before {
    position: absolute;
    top: 12px;
    left: 7px;
    box-sizing: border-box;
    display: block;
    width: 10px;
    height: 2px;
    color: white;
    content: '';
    background: currentColor;
    border-radius: 5px;
  }
  &::after {
    top: 8px;
    left: 11px;
    width: 2px;
    height: 10px;
  }
  &:hover {
    opacity: 1;
  }
`
export const ProjectAddIcon = (props: { addProject: () => void }) => {
  return <AddProjectButton onClick={props.addProject} />
}
