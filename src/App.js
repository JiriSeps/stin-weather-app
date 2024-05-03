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
import './currentDate.js';
import { apiKey, apiAdress, historyApi, historyApiSet } from './api';
import axios from 'axios';


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
  const [weatherHistory, setWeatherHistory] = useState([]);
  

  const setFavs = () => {
    const user = usersData.find(user => user.username === userName);
    const favorites = user.favorites;
    const options = favorites.map(item => <option key={item}>{item}</option>);
    // Return the select element with the styled options
    const selectElement = (
      <select className="favorites-select">
        <option></option>
        {options}
      </select>
    );
  
    // Render the select element
    setFavorites(selectElement);
  }

  const setFavoritesButton = (
    <button className="set-favorites-btn" onClick={setFavs}>Set Favorites</button>
  );
  
  
  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
  
    const username = usernameInput.value;
    const user = usersData.find(user => user.username === username);
  
    if (user) {
      const password = passwordInput.value;
      if (user.password === password) {
        if (user.pay === "yes") {
          // User has paid, proceed with login
          userName = username;
          setUser("valid");
          setHead(logout);
          setFavorites(setFavs);
          setMenuOpen(false); // Close the menu
          setLoginVisible(false); // Hide login menu
        } else {
          // Prompt user to pay first
          setHead(payment);
          setMenuOpen(false); // Close the menu
          setLoginVisible(false); // Hide login menu
        }
      } else {
        alert("Špatně zadané heslo.");
      }
    } else {
      alert("Uživatelské jméno neexistuje nebo je špatně zadané");
    }
  };
  
  
  const handleRegistration = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    const username = usernameInput.value;
    const password = passwordInput.value;
  
    // Send registration data to server
    axios.post('http://localhost:8081/register', {
      username,
      password
    })
    .then(response => {
      if (response.status === 201) {
        // Handle successful registration, e.g., prompt for payment
        setHead(payment); // Display payment form
        setLoginVisible(false); // Hide registration form
      } else if (response.status === 400) {
        // Account with the same username already exists
        alert('An account with the same username already exists. Please choose a different username.');
      } else {
        // Handle other registration errors
        alert('Registration failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    });
  };
  
  const handlePayment = () => {
    const cardInput = document.getElementById('cardnumber');
    const validInput = document.getElementById('validity');
    const cvcInput = document.getElementById('cvc');
  
    if (cardInput.value.length !== 19) {
      alert("Karta musí být formátu XXXX XXXX XXXX XXXX.")
    } else if (validInput.value.length !== 5) {
      alert("MM/YY.")
    } else if (cvcInput.value.length !== 3) {
      alert("Zadejte CVC ve formátu XXX.")
    } else {
      // Payment successful, proceed with login
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Update user data (assuming usersData is accessible here)
      usersData.push({ username, password, pay: "yes" });
  
      // Set user as logged in
      userName = username;
      setUser("valid");
      setHead(logout);
      setMenuOpen(false); // Close the menu
      setLoginVisible(false); // Hide login menu
    }
  };
  


  const handleLogout = () => {
    userName = ""
    setUser("")
    setHead(login)
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
    const fetchData = async () => {
      const historyData = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - i - 1); // Subtract i + 1 days to get historical dates
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
  
        const historyApiUrl = `${historyApi}latitude=${lat}&longitude=${long}${historyApiSet}start_date=${year}-${month}-${day}&end_date=${year}-${month}-${day}`;
        const response = await fetch(historyApiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        historyData.push({
          date: `${day}.${month}.${year}`,
          maxTemp: data.daily.temperature_2m_max,
          minTemp: data.daily.temperature_2m_min,
          precipitation: parseFloat(data.daily.precipitation_sum),
          rain: parseFloat(data.daily.rain_sum),
          shower: parseFloat(data.daily.showers_sum),
          snow: parseFloat(data.daily.snowfall_sum)
        });
      }
      setWeatherHistory(historyData.reverse()); // Reverse the array to display the oldest date first
    };
  
    fetchData().catch(error => {
      console.error('Chyba při získávání dat:', error);
    });
  }, [lat, long]);
  
  
  const renderTableRows = () => {
  return weatherHistory.map((data, index) => (
    <tr key={index}>
      <td>{data.date}</td>
      <td>{data.maxTemp} °C</td>
      <td>{data.minTemp} °C</td>
      <td>{(data.precipitation + data.rain + data.shower + data.snow).toFixed(1)} mm</td>
      </tr>
    ));
  };
  
  var table = (
    <div className="history">
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
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
  
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
        <div class="search-container">
          <input type="text" class="search-input" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
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
        <div class="search-container">
          <input type="text" class="search-input" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
          <div class="favs">
            {favorites}
          </div>
        </div>
        <div className="weather">
          <h2 className="city">{city}{setFavoritesButton}</h2>
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
