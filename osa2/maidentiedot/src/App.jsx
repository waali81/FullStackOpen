import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState()

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry() // reset!
  }

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <Filter value={search} onChange={handleSearchChange} />
      <Countries
      countries={filtered}
      selectedCountry={selectedCountry}
      onSelect={setSelectedCountry}
      />
    </div>
  )
}

export default App