import Dev from '@violet/web/src/components/layout/Dev'
import { pagesPath } from '@violet/web/src/utils/$path'
import Link from 'next/link'

const Home = () => {
  return (
    <Dev>
      <h1>開発用デモ: 認証デモ</h1>
      <Link href={pagesPath.dev.$url()}>
        <a>デモトップ</a>
      </Link>
      <div>
        <ul>
          <li>
            <Link href={pagesPath.dev.auth.public_comment.$url()}>
              <a>公開チャット、ログインしてコメントできる</a>
            </Link>
          </li>
          <li>
            <Link href={pagesPath.dev.auth.private_comment.$url()}>
              <a>非公開チャット、ログインしないと閲覧もできない</a>
            </Link>
          </li>
        </ul>
      </div>
    </Dev>
  )
}

export default Home
