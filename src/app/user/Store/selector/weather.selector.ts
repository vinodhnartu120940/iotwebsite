// src/app/store/weather/weather.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { WeatherState } from '../reducer/weather.reducer';

export const selectWeatherState =
  createFeatureSelector<WeatherState>('weather');

export const selectWeather = createSelector(
  selectWeatherState,
  (state: WeatherState) => state.weather
);

export const selectLatestWeather = createSelector(
  selectWeather,
  (weatherData) => {
    if (!weatherData || weatherData.list.length === 0) {
      return null;
    }
    const latestWeather = weatherData.list[0];
    const tempMaxCelsius = latestWeather.main.temp_max - 273.15;
    const feelsLikeCelsius = latestWeather.main.feels_like - 273.15;

    // Convert Unix timestamps to human-readable time
    const sunriseDate = new Date(weatherData.city.sunrise * 1000);
    const sunsetDate = new Date(weatherData.city.sunset * 1000);

    // Format the dates to a readable string
    const sunriseFormatted = sunriseDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    const sunsetFormatted = sunsetDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    return {
      temprature: tempMaxCelsius.toFixed(2),
      location: weatherData.city.name,
      country: weatherData.city.country,
      sunrise: sunriseFormatted,
      sunset: sunsetFormatted,
      description: latestWeather.weather[0].description,
      wind_speed: latestWeather.wind.speed,
      humidity: latestWeather.main.humidity,
      feelslikeTemprature: feelsLikeCelsius.toFixed(2),
      rainy: latestWeather.weather[0].description,
      visibility: latestWeather.visibility / 1000,
      cloudness: latestWeather.clouds.all,
      rain: latestWeather.rain?.['3h'],
      maxTemp: (latestWeather.main.temp_max - 273.15).toFixed(2),
      minTemp: (latestWeather.main.temp_min - 273.15).toFixed(2),
    };
  }
);

export const selectHourlyWeather = createSelector(
  selectWeather,
  (weatherData) => {
    if (!weatherData) {
      return [];
    }
    const processedWeather: any[] = [];
    const todayDateString = new Date().toDateString();
    const tomorrowDateString = new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toDateString();

    weatherData.list.forEach((weather, index) => {
      if (index < 8) {
        const date = new Date(weather.dt_txt);
        let formattedDate;

        if (date.toDateString() === todayDateString) {
          formattedDate = 'Today';
        } else if (date.toDateString() === tomorrowDateString) {
          formattedDate = 'Tomorrow';
        } else {
          formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: 'numeric',
          });
        }

        // Extract time in 'HH:MM AM/PM' format
        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const tempMaxCelsius = weather.main.temp - 273.15;

        processedWeather.push({
          date: formattedDate,
          time: time, // Add the time property
          temp: tempMaxCelsius.toFixed(2),
          icon: mapWeatherToFontAwesomeIcon(weather.weather[0].main),
          pop: (weather.pop * 100).toFixed(0) + '%',
        });
      }
    });

    return processedWeather;
  }
);


export const selectDailyWeather = createSelector(
  selectWeather,
  (weatherData) => {
    if (!weatherData) {
      return [];
    }

    const today = new Date().toDateString();
    const tomorrow = new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toDateString();

    const days = new Map<string, any>();

    weatherData.list.forEach((weather) => {
      const date = new Date(weather.dt_txt).toDateString();
      let formattedDate;
      if (date === today) {
        formattedDate = 'Today';
      } else if (date === tomorrow) {
        formattedDate = 'Tomorrow';
      } else {
        formattedDate = new Date(weather.dt_txt).toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      }

      const tempMaxCelsius = weather.main.temp_max - 273.15;
      const tempMinCelsius = weather.main.temp_min - 273.15;

      if (!days.has(date)) {
        days.set(date, {
          date: formattedDate,
          temp_max: tempMaxCelsius, // Keep as number for calculations
          temp_min: tempMinCelsius, // Keep as number for calculations
          icon: mapWeatherToFontAwesomeIcon(weather.weather[0].main),
          pop: (weather.pop * 100).toFixed(0) + '%', // Convert to percentage
          description: weather.weather[0].description,
          wind_speed: weather.wind.speed,
          humidity: weather.main.humidity,
        });
      } else {
        const existingWeather = days.get(date);
        existingWeather.temp_max = Math.max(
          existingWeather.temp_max,
          tempMaxCelsius
        );
        existingWeather.temp_min = Math.min(
          existingWeather.temp_min,
          tempMinCelsius
        );
      }
    });

    // Convert temp_max and temp_min to strings with 2 decimal places for display
    return Array.from(days.values()).map((weather) => ({
      ...weather,
      temp_max: weather.temp_max.toFixed(2),
      temp_min: weather.temp_min.toFixed(2),
    }));
  }
);

function mapWeatherToFontAwesomeIcon(main: string): string {
  const iconMap: { [key: string]: string } = {
    Clear: 'fas fa-sun', // Clear weather
    Clouds: 'fas fa-cloud', // Cloudy weather
    Rain: 'fas fa-cloud-showers-heavy', // Rainy weather
    Drizzle: 'fas fa-cloud-rain', // Light rain/drizzle
    Thunderstorm: 'fas fa-bolt', // Thunderstorm
    Snow: 'fas fa-snowflake', // Snow
    Mist: 'fas fa-smog', // Mist or fog
    Smoke: 'fas fa-smog', // Smoke
    Haze: 'fas fa-smog', // Haze
    Dust: 'fas fa-smog', // Dust
    Fog: 'fas fa-smog', // Fog
    Sand: 'fas fa-smog', // Sand
    Ash: 'fas fa-smog', // Ash
    Squall: 'fas fa-wind', // Squall
    Tornado: 'fas fa-tornado', // Tornado
  };

  return iconMap[main] || 'fas fa-question'; // Default to a question mark if no match found
}
