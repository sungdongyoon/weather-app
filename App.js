import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons'; 
import * as Location from 'expo-location';

const {width: SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = 'e948880ae1e5d9700d068bfc6fce5c65';

const icons = {
  Clouds: "cloudy",
  Rain: "rains",
  Clear: "day-sunny",
  Atomsphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const [currentWeather, setCurrentWeather] = useState([]);

  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(`${location[0].city} ${location[0].district}`);

    const weeklyWeatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const weeklyWeatherJson = await weeklyWeatherAPI.json();
    const weeklyWeatherData = await weeklyWeatherJson.list.filter((el) => el.dt_txt.includes("00:00:00"));
    setDays(weeklyWeatherData);

    const currentWeatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const currentWeatherJson = await currentWeatherAPI.json();
    const currentWeatherData = await currentWeatherJson;
    setCurrentWeather(currentWeatherData);
  }

  useEffect(() => {
    getWeather();
    console.log(currentWeather);
  }, [])

  return (
    <LinearGradient colors={["#f6d365", "#fda085"]} style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.title}>주간 날씨</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.current}>
        <Text style={styles.currentTitle}>현재 날씨</Text>
        <Text>아이콘</Text>
        <Text style={styles.currentTemp}>{currentWeather.main.temp}°</Text>
        <Text style={styles.currentDesc}>Rainy</Text>
      </View>
      <ScrollView horizontal pagingEnabled indicatorStyle='white' contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator color={"black"} size={"large"}/>
          </View> :
          days.map((weather, index) => (
            <View key={index} style={styles.day}>
              <Fontisto name={icons[weather.weather[0].main]} size={60} color="black"/>
              <Text style={styles.date}>{weather.dt_txt.substring(0, weather.dt_txt.indexOf("00"))}</Text>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={styles.temp}>최저:{Number(weather.main.temp_min).toFixed(1)}°  최고:{Number(weather.main.temp_max).toFixed(1)}°</Text>
              </View>
              <Text style={styles.description}>{weather.weather[0].main}</Text>
            </View>
          ))
        }
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  cityName: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    marginBottom: 50,
  },
  current: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
  currentTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  currentTemp: {
    fontSize: 20,
  },
  currentDesc: {
    fontSize: 25,
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  temp: {
    fontSize: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 25,
    marginTop: 10,
  },
  date: {
    fontSize: 15,
  }
})