import { createGlobalStyle } from 'styled-components'

const GlobalDevStyle = createGlobalStyle`
body {
  margin: 3em;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0.5em;
}

li {
  margin: 0.4em;
}

input {
  margin: 0.4em;
}

div {
  margin: 0.4em 0;
}

fieldset {
  padding: 0.2em 0.8em;
}

label, a {
  cursor: pointer;
}

label:hover, a:hover {
  border-bottom: 1px solid black;
}

code {
  padding: 0.1em;
  font-size: 0.96em;
  background: #efefef;
  border-radius: 0.2em;
}
`

const Dev: React.FC = ({ children }) => {
  return (
    <>
      <GlobalDevStyle />
      {children}
    </>
  )
}

export default Dev
