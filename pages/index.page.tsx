import type { Task } from '$prisma/client'
import useAspidaSWR from '@aspida/swr'
import Head from 'next/head'
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Spacer } from '~/components/atoms/Spacer'
import { Fetching } from '~/components/organisms/Fetching'
import { useApi } from '~/hooks'
import { staticPath } from '~/utils/$path'
import { UserBanner } from './components/UserBanner'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 0.5rem;
`

const StyledMain = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const Title = styled.h1`
  font-size: 4rem;
  line-height: 1.15;
  text-align: center;

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
`

const Tasks = styled.ul`
  width: 300px;
  padding: 0;
  margin: 20px auto 0;
  text-align: left;
  list-style-type: none;

  > li {
    border-bottom: 1px solid #eee;
  }
`

const StyledInput = styled.input`
  float: right;
`

const StyledFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Logo = styled.img`
  height: 1em;
  margin-left: 0.5rem;
`

const Home = () => {
  const { api, onErr } = useApi()
  const { data: tasks, error, mutate } = useAspidaSWR(api.tasks)
  const [label, setLabel] = useState('')
  const inputLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value), [])

  const createTask = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!label) return

      const res = await api.tasks.post({ body: { label } }).catch(onErr)

      if (!res) return

      setLabel('')
      mutate()
    },
    [label]
  )

  const toggleDone = useCallback(async (task: Task) => {
    const res = await api.tasks
      ._taskId(task.id)
      .patch({ body: { done: !task.done } })
      .catch(onErr)

    if (res) mutate()
  }, [])

  const deleteTask = useCallback(async (task: Task) => {
    const res = await api.tasks._taskId(task.id).delete().catch(onErr)

    if (res) mutate()
  }, [])

  if (!tasks) return <Fetching error={error} />

  return (
    <Container>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href={staticPath.favicon_png} />
      </Head>

      <StyledMain>
        <UserBanner />

        <Title>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </Title>
        <Spacer axis="y" size={16} />
        <div>
          <form style={{ textAlign: 'center' }} onSubmit={createTask}>
            <input value={label} type="text" onChange={inputLabel} />
            <input type="submit" value="ADD" />
          </form>
          <Tasks>
            {tasks.map((task, i) => (
              <React.Fragment key={task.id}>
                {i > 0 && <Spacer axis="y" size={12} />}
                <li>
                  <label>
                    <input type="checkbox" checked={task.done} onChange={() => toggleDone(task)} />
                    <span>{task.label}</span>
                  </label>
                  <StyledInput type="button" value="DELETE" onClick={() => deleteTask(task)} />
                </li>
              </React.Fragment>
            ))}
          </Tasks>
        </div>
      </StyledMain>

      <StyledFooter>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Logo src={staticPath.vercel_svg} alt="Vercel Logo" />
        </a>
      </StyledFooter>
    </Container>
  )
}

export default Home
