import Link from 'next/link'
import React, { useMemo, useState } from 'react'

interface Props {
  bucket: string
  allKeys: string[]
  folder: string
  selectedKeys?: Set<string> | undefined
  onChange?: ((newSelectedKeys: Set<string>) => void) | undefined
  isUriEncoded: boolean
}

const listObjects = (keys: string[], folder: string): string[] => {
  return keys.filter(
    (key) =>
      key.startsWith(folder) &&
      !key.endsWith('/') &&
      key.slice(folder.length).split('/').length === 1
  )
}

const TestSuite: React.FC<Props> = ({
  bucket,
  folder,
  allKeys,
  selectedKeys,
  onChange,
  isUriEncoded,
}) => {
  const objectKeys = listObjects(allKeys, folder)
  const documentKeys = useMemo(
    () => objectKeys.filter((key) => !key.toLowerCase().endsWith('.json')),
    [objectKeys]
  )
  const jsonKeyMap = useMemo(
    () =>
      new Map(
        objectKeys
          .filter((key) => key.toLowerCase().endsWith('.json'))
          .map((key) => [key.slice(0, -'.json'.length), key])
      ),
    [objectKeys]
  )
  const [open, setOpen] = useState(false)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={selectedKeys?.size === documentKeys.length}
          onChange={(ev) => {
            if (ev.target.checked) {
              onChange?.(new Set(documentKeys))
            } else {
              onChange?.(new Set())
            }
          }}
        />
        {isUriEncoded ? encodeURI(folder) : folder} ({selectedKeys?.size ?? 0}/{documentKeys.length}
        )
      </label>
      <a
        onClick={(ev) => {
          ev.preventDefault()
          setOpen(!open)
        }}
      >
        {open ? '▼ click here to close' : '▶ click here to open'}
      </a>
      {open && (
        <ul>
          {documentKeys.map((key) => (
            <li key={key}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedKeys?.has(key) ?? false}
                  onChange={(ev) => {
                    const copy = new Set(selectedKeys)
                    if (ev.target.checked) {
                      copy.add(key)
                    } else {
                      copy.delete(key)
                    }
                    onChange?.(copy)
                  }}
                />
                {isUriEncoded ? encodeURI(key) : key}
              </label>
              {'  '}
              <Link href={`https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`}>
                <a target="_blank">[DL]</a>
              </Link>
              {jsonKeyMap.has(key) && (
                <Link
                  href={`https://${bucket}.s3.amazonaws.com/${encodeURIComponent(
                    jsonKeyMap.get(key) || ''
                  )}`}
                >
                  <a target="_blank">[JSON]</a>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TestSuite
