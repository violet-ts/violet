import { Chevron } from '@violet/web/src/components/atoms/Chevron'
import type { PageDirection } from '@violet/web/src/types/tools'
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
const PreviousPage = styled.div`
  text-align: inherit;
`
const NextPage = styled.div`
  text-align: inherit;
  transform: rotate(180deg);
`

export const PaginationBar = (props: {
  clickPagenation: (pageDirection: PageDirection) => void
}) => {
  return (
    <Container>
      <PreviousPage onClick={() => props.clickPagenation('previousPage')}>
        <Chevron />
      </PreviousPage>
      <NextPage onClick={() => props.clickPagenation('nextPage')}>
        <Chevron />
      </NextPage>
    </Container>
  )
}
