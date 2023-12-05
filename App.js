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
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(`${location[0].city} ${location[0].district}`);
    const resopnse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await resopnse.json();
    const data = await json.list.filter((el) => el.dt_txt.includes("00:00:00"));
    setDays(data);
    console.log(days);
  }

  useEffect(() => {
    getWeather();
  }, [])
  return (
    <LinearGradient colors={["#f6d365", "#fda085"]} style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled indicatorStyle='white' contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator color={"black"} size={"large"}/>
          </View> :
          days.map((weather, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>{weather.dt_txt}</Text>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={styles.temp}>{Number(weather.main.temp).toFixed(1)}℃</Text>
                <Fontisto name={icons[weather.weather[0].main]} size={60} color="black"/>
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
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 40,
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 100,
    marginTop: 50,
  },
  description: {
    fontSize: 30,
    marginTop: -10,
  },
  date: {
    fontSize: 20,
  }
})