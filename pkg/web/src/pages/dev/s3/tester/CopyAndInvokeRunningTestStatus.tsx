import type { ResultStatus, RunningStatus } from '@violet/lib/s3/tester'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import MinioLink from './MinioLink'

const RedSpan = styled.span`
  color: red;
`

const GreenSpan = styled.span`
  color: green;
`

const Result: React.FC<{ status: ResultStatus }> = ({ status }) => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  })
  const time = (() => {
    if (status.startTime && status.endTime) {
      return <span>Done in {Math.floor((status.endTime - status.startTime) / 1000)} seconds.</span>
    } else if (status.startTime) {
      return <span>{Math.floor((now - status.startTime) / 1000)} seconds passed...</span>
    }
    return <></>
  })()
  const body = (() => {
    switch (status.type) {
      case 'waiting':
        return <span>💤</span>
      case 'running':
        return <span>🏃</span>
      case 'succeeded':
        return <GreenSpan>✔</GreenSpan>
      case 'failed':
        return <RedSpan>✗ ({status.errorMessage})</RedSpan>
      default:
        throw new Error(`unknown status: ${status}`)
    }
  })()
  return (
    <>
      {body}
      {time}
    </>
  )
}

interface Params {
  status: RunningStatus
}
const CopyAndInvokeRunningTestStatus: React.FC<Params> = ({ status }) => {
  return (
    <fieldset>
      <legend>Test Run Status</legend>
      <div>
        <ul>
          <li>bucket: {status.bucket}</li>
          <li>id: {status.id}</li>
          <li>
            この実行のオリジナルファイルリスト:{' '}
            <ul>
              <li>
                <code>docker-compose exec minio ls -lAR {status.minioOriginalDir}</code>
              </li>
              <li>
                <MinioLink minioPath={status.minioOriginalDir} />
              </li>
            </ul>
          </li>
          <li>
            この実行の変換後ファイルリスト:{' '}
            <ul>
              <li>
                <code>docker-compose exec minio ls -lAR {status.minioConvertedDir}</code>
              </li>
              <li>
                <MinioLink minioPath={status.minioConvertedDir} />
              </li>
            </ul>
          </li>
          <li>
            この実行の一時ファイルディレクトリ:{' '}
            <code>docker-compose exec lambda ls -lAR {status.tmpdir}</code>
          </li>
          <li>
            results:
            <ul>
              {Object.entries(status.results).map(([key, resultStatus]) => (
                <li key={key}>
                  <code>{encodeURI(key)}</code>: <Result status={resultStatus} />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </fieldset>
  )
}

export default CopyAndInvokeRunningTestStatus
