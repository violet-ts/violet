import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React from 'react'
import styled from 'styled-components'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`
const AlertMessage = styled.div`
  font-size: ${fontSizes.large};
`
const SecondaryButton = styled.button`
  width: 108px;
  height: 36px;
  font-size: ${fontSizes.large};
  color: ${colors.white};
  cursor: pointer;
  background-color: ${colors.gray};
  border: none;
  border-radius: 16px;
`
export const AlertModal = (props: { open: boolean; onClose: (state: boolean) => void }) => {
  return (
    <CardModal open={props.open} onClose={() => props.onClose(false)}>
      <Column>
        <Spacer axis="y" size={36} />
        <AlertMessage>Unsupported file format!</AlertMessage>
        <Spacer axis="y" size={36} />
        <SecondaryButton onClick={() => props.onClose(false)}>Confirm</SecondaryButton>
      </Column>
    </CardModal>
  )
}
