import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import React, { useEffect, useState } from 'react'
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
export const AlertModal = (props: { isOpen: boolean }) => {
  const [openAlert, setOpenAlert] = useState(false)
  useEffect(() => setOpenAlert(props.isOpen), [props.isOpen])

  return (
    <CardModal open={openAlert} onClose={() => setOpenAlert(false)}>
      <Column>
        <Spacer axis="y" size={36} />
        <AlertMessage>Unsupported file format!</AlertMessage>
        <Spacer axis="y" size={36} />
        <SecondaryButton onClick={() => setOpenAlert(false)}>Confirm</SecondaryButton>
      </Column>
    </CardModal>
  )
}
