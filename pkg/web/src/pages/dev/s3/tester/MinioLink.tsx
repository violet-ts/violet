import Link from 'next/link'

interface Props {
  minioPath: string
}

const MinioLink: React.FC<Props> = ({ minioPath }) => {
  const matches = minioPath.match(/^\/data\/([^/]*)\/(.*)$/)
  if (!matches) return <div>Error: MinIO Path broken</div>
  const bucket = matches[1]
  const key = matches[2]
  const encodedKey = window.btoa(key)
  const href = `http://localhost:9001/buckets/${bucket}/browse/${encodedKey}`
  return (
    <Link href={href}>
      <a target="_blank">{href}</a>
    </Link>
  )
}

export default MinioLink
