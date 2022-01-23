import { Chevron } from '@violet/web/src/components/atoms/Chevron'
import type { PageDirection } from '@violet/web/src/types/tools'
import { toolBarWidth } from '@violet/web/src/utils/constants'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: ${toolBarWidth}px;
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
  clickPagination: (pageDirection: PageDirection) => void
}) => {
  return (
    <Container>
      <PreviousPage onClick={() => props.clickPagination('previousPage')}>
        <Chevron />
      </PreviousPage>
      <NextPage onClick={() => props.clickPagination('nextPage')}>
        <Chevron />
      </NextPage>
    </Container>
  )
}
