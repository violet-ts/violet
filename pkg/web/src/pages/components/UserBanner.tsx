import { SignInModal } from '@violet/web/src/components/organisms/SignInModal'
import { useAuthContext } from '@violet/web/src/contexts/Auth'
import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px;
`

const Icon = styled.img`
  width: 32px;
  height: 32px;
  vertical-align: bottom;
  background: #ddd;
`

export const UserBanner = () => {
  const { currentUser, signOut } = useAuthContext()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <SignInModal
        open={modalOpen}
        onAuthCancel={() => setModalOpen(false)}
        onAuthSuccess={() => setModalOpen(false)}
      />
      <Container>
        {currentUser ? (
          <>
            <Icon
              src={
                currentUser.picture ||
                'https://raw.githubusercontent.com/icons8/flat-color-icons/master/svg/voice_presentation.svg'
              }
            />
            <span>{currentUser.name}</span>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <button onClick={() => setModalOpen(true)}>Sign in</button>
        )}
      </Container>
    </>
  )
}
