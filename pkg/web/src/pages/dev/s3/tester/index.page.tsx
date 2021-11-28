import useAspidaSWR from '@aspida/swr'
import { listAllKeysForPublicBucket } from '@violet/lib/s3/public-client'
import Dev from '@violet/web/src/components/layout/Dev'
import { useApiContext } from '@violet/web/src/contexts/Api'
import { pagesPath } from '@violet/web/src/utils/$path'
import type { NextPage } from 'next'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import CopyAndInvokeRunningTestStatus from './CopyAndInvokeRunningTestStatus'
import TestSuite from './Suite'

const listFolders = (keys: string[], folder: string): string[] => {
  return keys.filter(
    (key) =>
      key.startsWith(folder) &&
      key.endsWith('/') &&
      key.slice(folder.length).split('/').length === 2
  )
}

const Page: NextPage = () => {
  const [concurrency, setConcurrency] = useState(1)
  const [bucket, setBucket] = useState('violet-public-dev')
  const [newBucket, setNewBucket] = useState('violet-public-dev')
  const { api } = useApiContext()
  const copyAndInvokeRunningTest = useAspidaSWR(api.dev.test.works.copy_and_invoke, {
    refreshInterval: 3000, // 3s
  })
  const { data: allKeys } = useSWR(bucket, listAllKeysForPublicBucket)
  const suites = useMemo(
    () => (allKeys != null ? listFolders(allKeys, 'tests/works/') : []),
    [allKeys]
  )
  const [keysMap, setKeysMap] = useState(new Map<string, Set<string>>())

  useEffect(() => {
    if (copyAndInvokeRunningTest?.data?.running) {
      const interval = setInterval(() => {
        void copyAndInvokeRunningTest.mutate()
      }, 5000)
      return () => {
        clearInterval(interval)
      }
    }
    return () => {}
  }, [copyAndInvokeRunningTest])

  const selectedKeys = useMemo(() => [...keysMap.values()].flatMap((set) => [...set]), [keysMap])

  const runPutObjectTest = useCallback(() => {}, [])

  const runCopyAndInvokeTest = useCallback(async () => {
    await api.dev.test.works.copy_and_invoke.$post({
      body: { bucket, objectKeys: selectedKeys, concurrency },
    })
    await copyAndInvokeRunningTest.mutate()
  }, [
    api.dev.test.works.copy_and_invoke,
    bucket,
    concurrency,
    copyAndInvokeRunningTest,
    selectedKeys,
  ])

  return (
    <Dev>
      <h1>開発用ポータル: S3テスター</h1>
      <div>
        <Link href={pagesPath.dev.s3.$url()}>
          <a>S3操作に戻る</a>
        </Link>
      </div>
      <div>
        <label>
          <input type="text" value={newBucket} onChange={(ev) => setNewBucket(ev.target.value)} />
          S3 バケット名
        </label>
        <button disabled={bucket === newBucket} onClick={() => setBucket(newBucket)}>
          変更
        </button>
      </div>
      <div>
        S3 バケット名: <b>{bucket}</b>
      </div>
      {copyAndInvokeRunningTest.data && (
        <CopyAndInvokeRunningTestStatus status={copyAndInvokeRunningTest.data} />
      )}
      <fieldset>
        <legend>Test Run</legend>
        <div>
          <label>
            Concurrency:{' '}
            <input
              type="number"
              value={concurrency}
              onChange={(ev) => setConcurrency(+ev.target.value | 0)}
            />
          </label>
        </div>
        <div>
          <label>
            <button onClick={runPutObjectTest} disabled={selectedKeys.length === 0}>
              Run PutObject Test
            </button>
            : PutObject でイベント経由で Lambda を起動させる (TODO)
          </label>
        </div>
        <div>
          <label>
            <button
              onClick={runCopyAndInvokeTest}
              disabled={selectedKeys.length === 0 || copyAndInvokeRunningTest.data?.running}
            >
              Run Copy & Invoke Test
            </button>
            : <code>docker cp</code> のあとに JSON を直接送り込んで Lambda を起動させる
          </label>
        </div>
      </fieldset>
      <div>
        {allKeys && (
          <ul>
            {suites.map((suite) => (
              <li key={suite}>
                <TestSuite
                  allKeys={allKeys}
                  folder={suite}
                  selectedKeys={keysMap.get(suite)}
                  onChange={(newSelectedKeys) => {
                    const copy = new Map(keysMap)
                    copy.set(suite, newSelectedKeys)
                    setKeysMap(copy)
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dev>
  )
}

export default Page
