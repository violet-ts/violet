import { Chevron } from '@violet/web/src/components/atoms/Chevron'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 48px;
  height: 100%;
`
const ChevronUp = styled.div`
  text-align: inherit;
`
const ChevronDown = styled.div`
  text-align: inherit;
  transform: rotate(180deg);
`

export const PaginationBar = (props: { clickChevron: (chevronUp: boolean) => boolean }) => {
  return (
    <Container>
      <ChevronUp onClick={() => props.clickChevron(true)}>
        <Chevron />
      </ChevronUp>
      <ChevronDown onClick={() => props.clickChevron(false)}>
        <Chevron />
      </ChevronDown>
    </Container>
  )
}
