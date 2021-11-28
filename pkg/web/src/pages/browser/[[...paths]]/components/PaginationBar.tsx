import { Chevron } from '@violet/web/src/components/atoms/Chevron'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { mainColumnHeight } from '@violet/web/src/utils/constants'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: ${mainColumnHeight};
`
const ChevronUP = styled.div`
  text-align: inherit;
`
const ChevronDown = styled.div`
  text-align: inherit;
  transform: rotate(180deg);
`

export const PaginationBar = (props: { clickchevron: (chevronup: boolean) => boolean }) => {
  return (
    <Container>
      <ChevronUP onClick={() => props.clickchevron(true)}>
        <Chevron />
      </ChevronUP>
      <Spacer axis="y" size={160} />
      <ChevronDown onClick={() => props.clickchevron(false)}>
        <Chevron />
      </ChevronDown>
    </Container>
  )
}
