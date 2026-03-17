const Filter = ({ value, onChange }) => {
  return (
    <div>
      Find countries <input value={value} onChange={onChange} />
    </div>
  )
}

export default Filter