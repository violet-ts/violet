import { useCallback, useContext } from 'react'
import firebase from 'firebase/app'
import styles from '~/styles/UserBanner.module.css'
import { AuthContext } from '~/contexts/Auth'

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
    <div className={styles.userBanner}>
      {currentUser ? (
        <>
          <img src={currentUser.photoURL ?? ''} className={styles.userIcon} />
          <span>{currentUser.displayName}</span>
          <button onClick={logout}>LOGOUT</button>
        </>
      ) : (
        <>
          <button onClick={googleLogin}>Google LOGIN</button>
          <button onClick={githubLogin}>GitHub LOGIN</button>
        </>
      )}
    </div>
  )
}

export default UserBanner
