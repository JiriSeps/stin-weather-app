import React, { useState, useEffect } from 'react';
import sunImage from './assets/sun.png';
import humidityImage from './assets/humidity.png';
import windImage from './assets/wind.png';
import brokenCloudsImage from './assets/brokenclouds.png'
import fewCloudsImage from './assets/fewclouds.png'
import mistImage from './assets/mist.png'
import scatteredCloudsImage from './assets/scatteredclouds.png'
import showerRainImage from './assets/showerrain.png'
import snowImage from './assets/snow.png'
import thunderstormImage from './assets/thunderstorm.png'
import moonImage from './assets/moon.png'
import Cloudy from './assets/clouds.png'
import rainNImage from './assets/rainn.png'
import rainImage from './assets/rain.png'
import usersData from './users.json';
import hamburgerImage from './assets/hamburger.png'
import './index.css'; // Import CSS file
import { apiKey, apiAdress, historyApi, historyApiSet } from './api';


var userName = "";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false); // State to manage login section visibility
  const [user, setUser] = useState(''); // State to store the current username
  const [favorites, setFavorites] = useState(""); // Stav pro uložení vygenerovaného select elementu
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("Loading...");
  const [wind, setWind] = useState("Loading...");
  const [city, setCity] = useState("Tanvald");
  const [searchedCity, setSearchedCity] = useState("Tanvald");
  const [weatherImage, setWeatherImage] = useState({ sunImage });
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [precipitation, setPrecipitation] = useState("")
  const [rain, setRain] = useState("")
  const [shower, setShower] = useState("")
  const [snow, setSnow] = useState("")
  
  const {
    Day,
    Month,
    Year,
    Day2,
    Month2,
    Year2,
    Day3,
    Month3,
    Year3,
    Day4,
    Month4,
    Year4,
    Day5,
    Month5,
    Year5,
    Day6,
    Month6,
    Year6,
    Day7,
    Month7,
    Year7
  } = require('./currentDate');

  const setFavs = () => {
    const user = usersData.users.find(user => user.username === userName);
    const favorites = user.favorites;
    const options = favorites.map(item => <option key={item}>{item}</option>);
    const selectElement = (
      <select>
        <option>---</option>
        {options}
      </select>
    );
    setFavorites(selectElement);
  }
  
  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
  
    const username = usernameInput.value;
    const userExists = usersData.users.find(user => user.username === username);
  
    const password = passwordInput.value;
    const passwordMatch = usersData.users.find(user => user.username === username && user.password === password)
  
    const pay = usersData.users.find(user => user.username === username && user.password === password && user.pay === "yes")
  
    if (userExists && passwordMatch && pay) {
      userName = usernameInput.value;
      setUser("valid")
      setHead(logout)
      setFavorites(setFavs);
      setMenuOpen(false); // Close the menu
      setLoginVisible(false); // Hide login menu
    }
    else if (userExists && passwordMatch) {
      userName = usernameInput.value;
      usernameInput.value = '';
      passwordInput.value = '';
      setHead(payment)
      setMenuOpen(false); // Close the menu
      setLoginVisible(false); // Hide login menu
    }
    else if (userExists) {
      alert("Špatně zadané heslo.")
    }
    else {
      alert("Uživatelské jméno neexistuje nebo je špatně zadané")
    }
  };
  
  const handleRegistration = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
  
    const username = usernameInput.value;
    const userExists = usersData.users.find(user => user.username === username);
  
    if (userExists) {
      alert('Uživatelské jméno již existuje. Přihlaste se nebo zvolte jiné.');
    }
    else if (usernameInput.value.length < 4) {
      alert("Uživatelské jméno musí být dlouhé alespoň 4 znaky.")
    }
    else if (passwordInput.value.length < 5) {
      alert("Heslo musí být dlouhé alespoň 5 znaků.")
    }
    else {
      userName = usernameInput.value;
      usernameInput.value = '';
      passwordInput.value = '';
      setHead(payment);
      setMenuOpen(false); // Close the menu
      setLoginVisible(false); // Hide login menu
    }
  };

  const handleLogout = () => {
    userName = ""
    setUser("")
    setHead(login)
  }
  
  const handlePayment = () => {
    const cardInput = document.getElementById('cardnumber');
    const validInput = document.getElementById('validity');
    const cvcInput = document.getElementById('cvc');

    if (cardInput.value.length !== 19) {
      alert("Karta musí být formátu XXXX XXXX XXXX XXXX.")
    }

    else if (validInput.value.length !== 5) {
      alert("MM/YY.")
    }

    else if (cvcInput.value.length !== 3) {
      alert("Zadejte CVC ve formátu XXX.")
    }
    else {
      setUser("valid")
      setHead(logout)
    }
  }

  const login = (
    <div className="head">
      <div className="text">
        Pro rozšírené funkce se přihlaste
      </div>
      <div className="log" style={{ display: loginVisible ? 'block' : 'none' }}>
        <div className="inputs">
          <input type="text" id="username" placeholder="Uživatelské jméno"></input>
          <input type="password" id="password" placeholder="Heslo"></input>
        </div>
        <div className="buttons">
          <button onClick={handleLogin}>Přihlásit se</button>
          <button onClick={handleRegistration}>Registrovat</button>
        </div>
      </div>
    </div>
  );

  const [head, setHead] = useState(login);

  const payment = (
    <div className="payment">
      <div className="number">
        <input type="text" id="cardnumber" placeholder="Číslo karty"></input>
      </div>
    <div className="expiry-cvc">
      <div className="expiry">
        <input type="text" id="validity" placeholder="Platnost karty"></input>
      </div>
      <div className="cvc">
        <input type="text" id="cvc" placeholder="CVC"></input>
      </div>
    </div>
    <button onClick={handlePayment}>Zaplatit</button>
  </div>
  );
  const logout = (
    <div className="logout">
      <button onClick={handleLogout}>Odhlásit</button>
    </div>
  );

   const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchedCity(event.target.value);
      event.target.value = "";
    }
  };

  const setWeatherStatus = (status) => {
    switch (status) {
      case "01d":
        setWeatherImage(sunImage);
        break;
      case "01n":
        setWeatherImage(moonImage);
        break;
      case "02d":
        setWeatherImage(fewCloudsImage);
        break;
      case "02n":
        setWeatherImage(Cloudy);
        break;
      case "04d":
      case "04n":
        setWeatherImage(brokenCloudsImage);
        break;
      case "50d":
      case "50n":
        setWeatherImage(mistImage);
        break;
      case "03d":
      case "03n":
        setWeatherImage(scatteredCloudsImage);
        break;
      case "09d":
      case "09n":
        setWeatherImage(showerRainImage);
        break;
      case "13d":
      case "13n":
        setWeatherImage(snowImage);
        break;
      case "11d":
      case "11n":
        setWeatherImage(thunderstormImage);
        break;
      case "10d":
        setWeatherImage(rainImage);
        break;
      case "10n":
        setWeatherImage(rainNImage);
        break;
      default:
        setWeatherImage(sunImage);
        break;
    }
  };

  useEffect(() => {
    const apiUrl = `${apiAdress}${searchedCity}&appid=${apiKey}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTemperature(data.main.temp.toFixed(1) + "°C");
        setHumidity(data.main.humidity + "%");
        setWind(data.wind.speed.toFixed(1) + "km/h");
        setCity(data.name);
        setWeatherStatus(data.weather[0].icon);
        setLong(data.coord.lon);
        setLat(data.coord.lat);
      })
      .catch(error => {
        console.error('Chyba při získávání dat:', error);
      });
  }, [searchedCity]);

  useEffect(() => {
    const historyApiUrl = `${historyApi}latitude=${lat}&longitude=${long}${historyApiSet}start_date=${Year7}-${Month7}-${Day7}&end_date=${Year}-${Month}-${Day}`
    fetch(historyApiUrl)
      .then(historyResponse => {
        if (!historyResponse.ok) {
          throw new Error('Network response was not ok');
        }
        return historyResponse.json();
      })
      .then(historyData => {
        setMaxTemp(historyData.daily.temperature_2m_max);
        setMinTemp(historyData.daily.temperature_2m_min);
        setPrecipitation(historyData.daily.precipitation_sum)
        setRain(historyData.daily.rain_sum)
        setShower(historyData.daily.showers_sum)
        setSnow(historyData.daily.snowfall_sum)
      })
      .catch(error => {
        console.error('Chyba při získávání dat:', error);
      });
  }, [long, lat, Day, Month, Year, Day7, Month7, Year7]);

  var table = <div className="history">
    <table className="historyTable" border="1">
      <thead>
        <tr>
          <th className="date">Datum</th>
          <th className="highTemp">Max. teplota</th>
          <th className="lowTemp">Min. teplota</th>
          <th className="rain">Srážky</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{Day}.{Month}.{Year}</td>
          <td>{maxTemp[6]} °C</td>
          <td>{minTemp[6]} °C</td>
          <td>{(precipitation[6] + rain[6] + shower[6] + snow[6]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day2}.{Month2}.{Year2}</td>
          <td>{maxTemp[5]} °C</td>
          <td>{minTemp[5]} °C</td>
          <td>{(precipitation[5] + rain[5] + shower[5] + snow[5]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day3}.{Month3}.{Year3}</td>
          <td>{maxTemp[4]} °C</td>
          <td>{minTemp[4]} °C</td>
          <td>{(precipitation[4] + rain[4] + shower[4] + snow[4]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day4}.{Month4}.{Year4}</td>
          <td>{maxTemp[3]} °C</td>
          <td>{minTemp[3]} °C</td>
          <td>{(precipitation[3] + rain[3] + shower[3] + snow[3]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day5}.{Month5}.{Year5}</td>
          <td>{maxTemp[2]} °C</td>
          <td>{minTemp[2]} °C</td>
          <td>{(precipitation[2] + rain[2] + shower[2] + snow[2]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day6}.{Month6}.{Year6}</td>
          <td>{maxTemp[1]} °C</td>
          <td>{minTemp[1]} °C</td>
          <td>{(precipitation[1] + rain[1] + shower[1] + snow[1]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{Day7}.{Month7}.{Year7}</td>
          <td>{maxTemp[0]} °C</td>
          <td>{minTemp[0]} °C</td>
          <td>{(precipitation[0] + rain[0] + shower[0] + snow[0]).toFixed(1)} mm</td>
        </tr>
      </tbody>
    </table>
  </div>

  if (user === "") {
    return (
      <div className="block">
        {/* Your menu icon */}
        <img src={hamburgerImage} alt="Hamburger Menu" className="hamburger" style={{ width: '30px' }} onClick={handleMenuToggle} />
        
        {/* Your menu items */}
        {menuOpen && (
          <div className="menu">
            <div className="menu-content">
              {/* Place your menu items here */}
              <div className="head">
                <div className="log">
                  <div className="inputs">
                    <input type="text" id="username" placeholder="Uživatelské jméno"></input>
                    <input type="password" id="password" placeholder="Heslo"></input>
                  </div>
                  <div className="buttons">
                    <button onClick={handleLogin} >Přihlásit se</button>
                    <button onClick={handleRegistration}>Registrovat</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {head}
        <div className="search">
          <input type="text" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
        </div>
        <div className="weather">
          <h2 className="city">{city}</h2>
          <img src={weatherImage} className="weather-icon" alt=""></img>
          <h1 className="temp">{temperature}</h1>
          <div className="details">
            <div className="col">
              <img src={humidityImage} alt=""></img>
              <div>
                <p className="humidity">{humidity}</p>
                <p>Vlhkost</p>
              </div>
            </div>
            <div className="col">
              <img src={windImage} alt=""></img>
              <div>
                <p className="wind">{wind}</p>
                <p className="desc">Rychlost větru</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="block">
        {head}
        <div className="search">
          <input type="text" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
          <div className="favs">
            {favorites}
          </div>
        </div>
        <div className="weather">
          <h2 className="city">{city}</h2>
          <img src={weatherImage} className="weather-icon" alt=""></img>
          <h1 className="temp">{temperature}</h1>
          <div className="details">
            <div className="col">
              <img src={humidityImage} alt=""></img>
              <div>
                <p className="humidity">{humidity}</p>
                <p>Vlhkost</p>
              </div>
            </div>
            <div className="col">
              <img src={windImage} alt=""></img>
              <div>
                <p className="wind">{wind}</p>
                <p className="desc">Rychlost větru</p>
              </div>
            </div>
          </div>
        </div>
        {table}
      </div>
    );
  }
}

export default App;
