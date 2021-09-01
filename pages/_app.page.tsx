import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
import { ApiProvider } from '~/contexts/Api'
import { fontSizes } from '~/utils/constants'
import { AuthProvider } from '../contexts/Auth'

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: ${fontSizes.standard};
  line-height: 1;
}

a {
  color: inherit;
  text-decoration: none;
}
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <ApiProvider>
          <Component {...pageProps} />
        </ApiProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
