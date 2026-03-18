import { useEffect, useState } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    console.log('api avain', apiKey)
    if (!country.capital) return

    const capital = country.capital[0]

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Virhe haettaessa säätä:', error)
      })
  }, [country.capital])

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

      
      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}:</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Feels like: {weather.main.feels_like}</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  )
}

export default Country