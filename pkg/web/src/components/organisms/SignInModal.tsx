import { CardModal } from '@violet/web/src/components/organisms/CardModal'
import { useApi, useAuth } from '@violet/web/src/hooks'
import { colors, fontSizes } from '@violet/web/src/utils/constants'
import { auth, EmailAuthProvider, GithubAuthProvider } from '@violet/web/src/utils/firebase'
import { useMemo } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import styled from 'styled-components'

const Message = styled.div`
  font-size: ${fontSizes.large};
`

const Note = styled.div`
  font-size: ${fontSizes.medium};
  color: ${colors.red};
`

const Right = styled.div`
  display: flex;
  justify-content: end;
`

const AlreadyLoggedIn = () => <Note>すでにログインしています</Note>
const LoadingIcon = () => <span>loading...</span>

interface Props {
  open?: boolean
  onAuthCancel?: () => void
  onAuthSuccess?: () => void
}

export const SignInModal: React.FC<Props> = ({ open, onAuthCancel, onAuthSuccess }: Props) => {
  const { api } = useApi()
  const { currentUser, refresh: refreshAuth, initialized } = useAuth()
  const uiConfig: firebaseui.auth.Config = useMemo(
    () => ({
      signInFlow: 'popup',
      signInOptions: [
        // 表示・非表示を設定するのみ。実際にその方法が成功するかは GCIP 側で設定する
        ...(process.env.NEXT_PUBLIC_AUTH_SHOW_EMAIL === '1' ? [EmailAuthProvider.PROVIDER_ID] : []),
        GithubAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          const newUser = auth?.currentUser
          if (!newUser) throw new Error('Failed to get current user.')
          newUser.getIdToken().then(async (idToken) => {
            try {
              onAuthSuccess?.()
            } finally {
              await auth?.signOut()
              await api.auth.session.$post({
                body: {
                  idToken,
                },
              })
              await refreshAuth()
            }
          })
          return false
        },
      },
    }),
    [api, onAuthSuccess, refreshAuth]
  )

  const Main = () =>
    currentUser ? (
      <AlreadyLoggedIn />
    ) : (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    )

  return (
    <CardModal open={open} onClose={onAuthCancel}>
      <Message>ログイン</Message>
      {initialized ? <Main /> : <LoadingIcon />}
      <Right>
        <button onClick={onAuthCancel}>閉じる</button>
      </Right>
    </CardModal>
  )
}
