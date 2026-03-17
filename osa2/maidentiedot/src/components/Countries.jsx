import Country from './Country'

const Countries = ({ countries, onSelect, selectedCountry }) => {
  if (selectedCountry) {
    return <Country country={selectedCountry} />
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common} {' '}
            <button onClick={() => onSelect(country)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return null
}

export default Countries