import styled from 'styled-components'

const StyledWorkAdd = styled.i`
  position: relative;
  box-sizing: border-box;
  float: right;
  width: 12px;
  height: 13px;
  margin: 1px 0;
  margin-right: 10px;
  overflow: hidden;
  color: #333;
  background: linear-gradient(to bottom, #333 5px, transparent 0) no-repeat 1px 6px/6px 2px;
  border: 2px solid transparent;
  border-top: 0;
  border-right: 0;
  border-radius: 1px;
  border-top-right-radius: 4px;
  box-shadow: 0 0 0 2px;
  opacity: 0.3;
  transition: opacity 0.5s;
  transform: scale(var(--ggs, 1));

  &::after,
  &::before {
    position: absolute;
    box-sizing: border-box;
    display: block;
    height: 6px;
    color: #333;
    content: '';
  }

  &::before {
    top: 4px;
    left: 3px;
    width: 2px;
    background: #333;
  }

  &::after {
    top: -1px;
    right: -1px;
    width: 5px;
    border-bottom: 2px solid;
    border-left: 2px solid;
  }

  &:hover {
    opacity: 1;
  }
`

const StyledDirAdd = styled.i`
  position: relative;
  box-sizing: border-box;
  float: right;
  width: 20px;
  height: 13px;
  margin: 1.5px 0 1px;
  margin-right: 10px;
  color: #333;
  background: linear-gradient(to left, #333 10px, transparent 0) no-repeat 7px 2px/2px 6px;
  border: 2px solid;
  border-radius: 3px;
  opacity: 0.3;
  transition: opacity 0.5s;
  transform: scale(var(--ggs, 1));

  &::after,
  &::before {
    position: absolute;
    box-sizing: border-box;
    display: block;
    color: #333;
    content: '';
  }

  &::before {
    top: 4px;
    left: 5px;
    width: 6px;
    height: 2px;
    background: #333;
  }

  &::after {
    top: -5px;
    width: 9px;
    height: 4px;
    border: 2px solid;
    border-bottom: 0;
    border-radius: 2px 4px 0 0;
  }

  &:hover {
    opacity: 1;
  }
`

export const AddArea = (props: { addWork: () => void; addDir: () => void }) => {
  return (
    <>
      <StyledWorkAdd onClick={props.addWork} />
      <StyledDirAdd onClick={props.addDir} />
    </>
  )
}
