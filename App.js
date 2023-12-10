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

  const coutnDate = ["내일", "모레", "글피", "그글피", "닷새뒤"];

  return (
    <LinearGradient colors={["#DDE3EA", "#ddd"]} style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.current}>
        <Text style={styles.currentTemp}>{currentWeather.weather[0].description}</Text>
        <View style={styles.currentWeatherInfo}>
          <Text style={styles.currentTemp}>{currentWeather.main?.temp}℃</Text>
          <Text style={styles.currentDesc}>{currentWeather.weather[0].description}</Text>
        </View>
      </View>
      <ScrollView horizontal pagingEnabled indicatorStyle='white' contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator color={"black"} size={"large"}/>
          </View> :
          days.map((weather, index) => (
            <View key={index} style={styles.day}>
              <View style={styles.dateWrap}>
                <Text style={styles.countDate}>{coutnDate[index]}</Text>
                <Text style={styles.date}>{weather.dt_txt.substring(0, weather.dt_txt.indexOf("00"))}</Text>
              </View>
              <Fontisto name={icons[weather.weather[0].main]} size={60} color="black"/>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={styles?.temp}>최저:{Number(weather.main?.temp_min).toFixed(1)}°  최고:{Number(weather.main?.temp_max).toFixed(1)}°</Text>
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cityName: {
    fontSize: 35,
  },
  current: {
    flex: 2,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  currentTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  currentWeatherInfo: {
    alignItems: "center",
  },
  currentTemp: {
    fontSize: 35,
  },
  currentDesc: {
    fontSize: 15,
    color: "#999"
  },
  weather: {
    
  },
  day: {
    flex: 0.5,
    width: SCREEN_WIDTH,
    alignItems: "center",
    gap: 10,
  },
  temp: {
    fontSize: 20,
  },
  description: {
    fontSize: 25,
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  countDate: {
    fontSize: 30,
    fontWeight: "bold",
  },
  date: {
    fontSize: 15,
  }
})