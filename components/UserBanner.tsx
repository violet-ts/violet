import firebase from 'firebase/app'
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
  background: #ddd;
  vertical-align: bottom;
`

const UserBanner = () => {
  const { currentUser } = useContext(AuthContext)

  const googleLogin = useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }, [])

  const githubLogin = useCallback(async () => {
    const provider = new firebase.auth.GithubAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }, [])

  const logout = useCallback(() => {
    firebase.auth().signOut()
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
        <>
          <button onClick={googleLogin}>Google LOGIN</button>
          <button onClick={githubLogin}>GitHub LOGIN</button>
        </>
      )}
    </Container>
  )
}

export default UserBanner
