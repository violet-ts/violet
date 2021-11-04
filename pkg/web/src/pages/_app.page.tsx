import { ApiProvider } from '@violet/web/src/contexts/Api'
import { BrowserProvider } from '@violet/web/src/contexts/Browser'
import { fontSizes } from '@violet/web/src/utils/constants'
import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
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
          <BrowserProvider>
            <Component {...pageProps} />
          </BrowserProvider>
        </ApiProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
