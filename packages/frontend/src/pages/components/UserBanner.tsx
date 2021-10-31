import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '~/contexts/Auth'

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
  const { currentUser } = useContext(AuthContext)

  const googleLogin = useCallback(() => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(getAuth(), provider)
  }, [])

  const logout = useCallback(() => {
    signOut(getAuth())
  }, [])

  return (
    <Container>
      {currentUser ? (
        <>
          <Icon src={currentUser.photoURL ?? ''} />
          <span>{currentUser.displayName}</span>
          <button onClick={logout}>LOGOUT</button>
        </>
      ) : (
        <button onClick={googleLogin}>Google LOGIN</button>
      )}
    </Container>
  )
}
