const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const successStyle = {
    color: 'darkgreen',
    background: 'lightgreen',
    fontSize: 18,
    border: '2px solid green',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 18,
    border: '2px solid red',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const style = message.type === 'error' ? errorStyle : successStyle

  return (
    <div style={style}>
      {message.message}
    </div>
  )
}

export default Notification