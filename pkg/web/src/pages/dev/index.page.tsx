import { pagesPath } from '@violet/web/src/utils/$path'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <h1>開発用デモトップページ</h1>
      <div>
        <Link href={pagesPath.dev.auth.$url()}>
          <a>認証デモ</a>
        </Link>
      </div>
    </div>
  )
}

export default Home
