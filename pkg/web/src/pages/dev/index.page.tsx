import Dev from '@violet/web/src/components/layout/Dev'
import { pagesPath } from '@violet/web/src/utils/$path'
import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <Dev>
      <h1>開発用ポータル: トップページ</h1>
      <div>
        <ul>
          <li>
            <Link href={pagesPath.dev.auth.$url()}>
              <a>認証デモ</a>
            </Link>
          </li>
          <li>
            <Link href={pagesPath.dev.s3.$url()}>
              <a>S3操作</a>
            </Link>
          </li>
        </ul>
      </div>
    </Dev>
  )
}

export default Home
