const Country = ({ country }) => {
  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p>Population: {country.population}</p>

      <h3>Languages</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" />
    </div>
  )
}

export default Country