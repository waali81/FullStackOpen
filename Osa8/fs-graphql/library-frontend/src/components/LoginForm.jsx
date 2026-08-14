import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setPage, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setPage('authors')
    },
    onError: () => {
      setErrorMessage('login failed')
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    login({
      variables: {
        username,
        password,
      },
    })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              name='user'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              name='password'
              type="password"
              autoComplete='off'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm