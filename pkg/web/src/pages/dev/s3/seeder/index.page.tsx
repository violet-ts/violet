import Dev from '@violet/web/src/components/layout/Dev'
import { pagesPath } from '@violet/web/src/utils/$path'
import type { NextPage } from 'next'
import Link from 'next/link'

const Page: NextPage = () => {
  return (
    <Dev>
      <h1>開発用ポータル: S3 Seeder</h1>
      <Link href={pagesPath.dev.s3.$url()}>
        <a>S3操作に戻る</a>
      </Link>
      <div />
    </Dev>
  )
}

export default Page
