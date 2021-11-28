import Dev from '@violet/web/src/components/layout/Dev'
import { pagesPath } from '@violet/web/src/utils/$path'
import type { NextPage } from 'next'
import Link from 'next/link'

const Page: NextPage = () => {
  return (
    <Dev>
      <h1>開発用ポータル: S3操作</h1>
      <Link href={pagesPath.dev.$url()}>
        <a>デモトップ</a>
      </Link>
      <div>
        <ul>
          <li>
            <Link href={pagesPath.dev.s3.seeder.$url()}>
              <a>S3 Seeder</a>
            </Link>
          </li>
          <li>
            <Link href={pagesPath.dev.s3.tester.$url()}>
              <a>S3テスター</a>
            </Link>
          </li>
        </ul>
      </div>
    </Dev>
  )
}

export default Page
