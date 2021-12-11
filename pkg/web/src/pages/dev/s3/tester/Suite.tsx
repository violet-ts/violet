import Link from 'next/link'
import React, { useState } from 'react'

interface Props {
  bucket: string
  allKeys: string[]
  folder: string
  selectedKeys?: Set<string> | undefined
  onChange?: ((newSelectedKeys: Set<string>) => void) | undefined
}

const listObjects = (keys: string[], folder: string): string[] => {
  return keys.filter(
    (key) =>
      key.startsWith(folder) &&
      !key.endsWith('/') &&
      key.slice(folder.length).split('/').length === 1
  )
}

const TestSuite: React.FC<Props> = ({ bucket, folder, allKeys, selectedKeys, onChange }) => {
  const objectKeys = listObjects(allKeys, folder)
  const [open, setOpen] = useState(false)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={selectedKeys?.size === objectKeys.length}
          onChange={(ev) => {
            if (ev.target.checked) {
              onChange?.(new Set(objectKeys))
            } else {
              onChange?.(new Set())
            }
          }}
        />
        {encodeURI(folder)} ({selectedKeys?.size ?? 0}/{objectKeys.length})
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
          {objectKeys.map((key) => (
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
                {encodeURI(key)}
              </label>
              {'  '}
              <Link href={`https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`}>
                <a target="_blank">[DL]</a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TestSuite
