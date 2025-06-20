import { useEffect, useState } from "react";
import { useGeolocation } from "react-use";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { latitude, longitude, error: locationError } = useGeolocation();
  const lang = navigator.language.split("-")[0];

  const getWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=66c14820658edce0cbb62e2f1aab5c84&lang=${lang}`
      );
      setData(response.data);
      console.log("Hava durumu verisi alındı:", response.data);
    } catch (error) {
      console.error("Hava durumu verisi alınamadı:", error);
      setError("Hava durumu verisi alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationError) {
      setError("Konum erişimi reddedildi. Lütfen konum erişimine izin verin.");
      setLoading(false);
    } else if (latitude && longitude) {
      getWeatherData(latitude, longitude);
    }
  }, [latitude, longitude, locationError]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Hava durumu yükleniyor...</p>
          <p className="loading-detail">Konum alınıyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Hata</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app">
        <div className="error">
          <h2>Veri Bulunamadı</h2>
          <p>Hava durumu bilgileri alınamadı.</p>
        </div>
      </div>
    );
  }

  const tempDate = new Date(data.dt * 1000);
  return (
    <div className="app">
      <div className="weather-card">
        <div className="location">
          <h1>
            {data.name}, {data.sys.country}
          </h1>
          <p className="date">{tempDate.toLocaleDateString()}</p>
        </div>

        <div className="weather-info">
          <div className="temperature">
            <h2>{Math.round(data.main.temp - 273.15)}°C</h2>
            <p className="description">{data.weather[0].description}</p>
          </div>
        </div>

        <div className="details">
          <div className="detail">
            <div className="detail-icon">💨</div>
            <div className="detail-text">
              <span>Rüzgar</span>
              <span>{Math.round(data.wind.speed * 3.6)} km/h</span>
            </div>
          </div>
          <div className="detail">
            <div className="detail-icon">💧</div>
            <div className="detail-text">
              <span>Nem</span>
              <span>{data.main.humidity}%</span>
            </div>
          </div>
          <div className="detail">
            <div className="detail-icon">👁️</div>
            <div className="detail-text">
              <span>Görüş</span>
              <span>{Math.round(data.visibility / 1000)} km</span>
            </div>
          </div>
          <div className="detail">
            <div className="detail-icon">🌡️</div>
            <div className="detail-text">
              <span>Basınç</span>
              <span>{data.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
