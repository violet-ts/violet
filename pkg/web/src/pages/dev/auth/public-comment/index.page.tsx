import useAspidaSWR from '@aspida/swr'
import { Spacer } from '@violet/web/src/components/atoms/Spacer'
import { SignInModal } from '@violet/web/src/components/organisms/SignInModal'
import { useApi, useAuth } from '@violet/web/src/hooks'
import { pagesPath } from '@violet/web/src/utils/$path'
import Link from 'next/link'
import type { FormEvent } from 'react'
import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 0.5rem;
`

const StyledMain = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const History = styled.div`
  max-height: 300px;
  padding: 20px;
  overflow-y: auto;
  border: 1px solid black;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Fieldset = styled.fieldset`
  padding: 20px;
`

const Title = styled.h1`
  font-size: 1rem;
  line-height: 1.15;
  text-align: center;

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
`

const UserPicture = ({ picture }: { picture: string | null | undefined }) => (
  <img
    src={
      picture ||
      'https://raw.githubusercontent.com/icons8/flat-color-icons/master/svg/voice_presentation.svg'
    }
    width="32"
    height="32"
  />
)

const LoadingIcon = () => <span>loading...</span>

const Home = () => {
  const { api } = useApi()
  const { data: comments, mutate } = useAspidaSWR(api.dev.comment.public)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const { currentUser, initialized, signOut } = useAuth()

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    await api.dev.comment.public.$post({ body: 'foo' })
    await mutate()
  }

  const Actions = () =>
    currentUser ? (
      <button type="submit">コメント</button>
    ) : (
      <button
        onClick={(ev) => {
          ev.preventDefault()
          setIsSignInModalOpen(true)
        }}
      >
        ログインしてコメント
      </button>
    )

  const Form = () => (
    <form action="" onSubmit={onSubmit}>
      <Row>
        {currentUser && <UserPicture picture={currentUser.picture} />}
        <input type="text" name="comment" value="foo" readOnly />
        <Spacer axis="x" size={16} />
        <div>{initialized ? <Actions /> : <LoadingIcon />}</div>
      </Row>
      <Spacer axis="y" size={16} />
      <Fieldset>
        <legend>debug</legend>
        <button type="submit">強制的にコメントリクエスト (401 が帰る)</button>
      </Fieldset>
    </form>
  )

  return (
    <Container>
      <SignInModal
        open={isSignInModalOpen}
        onAuthCancel={() => setIsSignInModalOpen(false)}
        onAuthSuccess={() => {
          setIsSignInModalOpen(false)
          mutate()
        }}
      />

      <StyledMain>
        <Link href={pagesPath.dev.auth.$url()}>
          <a>認証デモトップに戻る</a>
        </Link>
        <Title>ログインデモ: 誰でも読めるが、サインインしないとコメントできないチャット</Title>
        <Spacer axis="y" size={16} />
        <History>
          {comments?.map(({ picture, comment }, i) => (
            <div key={i}>
              <UserPicture picture={picture} /> {comment}
            </div>
          ))}
        </History>
        <Spacer axis="y" size={16} />
        <div>
          <Form />
        </div>
        <Spacer axis="y" size={32} />
        <div>{initialized && currentUser && <button onClick={signOut}>ログアウト</button>}</div>
      </StyledMain>
    </Container>
  )
}

export default Home
