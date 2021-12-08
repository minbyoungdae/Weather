import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
import Wave from "react-native-waveview";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const API_KEY = "a96c269af8e2de7680106950d65e1873";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};
const mainIcons = {
  day: {
    Clouds: require("./assets/images/day_clouds.png"),
    Clear: require("./assets/images/day_clear.png"),
    Atmosphere: require("./assets/images/day_atmosphere.png"),
    Snow: require("./assets/images/day_snow.png"),
    Rain: require("./assets/images/day_rain.png"),
    Drizzle: require("./assets/images/day_drizzle.png"),
    Thunderstorm: require("./assets/images/day_thunderstorm.png"),
  },
  night: {
    Clouds: require("./assets/images/night_clouds.png"),
    Clear: require("./assets/images/night_clear.png"),
    Atmosphere: require("./assets/images/night_atmosphere.png"),
    Snow: require("./assets/images/night_snow.png"),
    Rain: require("./assets/images/night_rain.png"),
    Drizzle: require("./assets/images/night_drizzle.png"),
    Thunderstorm: require("./assets/images/night_thunderstorm.png"),
  },
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const getWeather = async () => {
    await Location.requestForegroundPermissionsAsync();
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].region);
    const response = fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=${"en"}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await (await response).json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  const getDate = (date) => {
    const week = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const dayOfWeek = week[new Date(date * 1000).getDay()];
    return dayOfWeek;
  };

  const getDaysAndNights = () => {
    const sunRise = new Date(days[0].sunrise * 1000).getHours();
    const sunSet = new Date(days[0].sunset * 1000).getHours();
    let daysAndNights = "";

    new Date().getHours() > sunRise && new Date().getHours() < sunSet
      ? (daysAndNights = "day")
      : (daysAndNights = "night");
    return daysAndNights;
  };

  return (
    <View style={style.container}>
      {!days.length ? (
        <View style={style.loading}>
          <ActivityIndicator
            color="black"
            size="large"
            style={style.loadingIcon}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={style.city}>
            <ImageBackground
              source={
                getDaysAndNights() === "day"
                  ? require("./assets/images/day_bg.png")
                  : require("./assets/images/night_bg.png")
              }
              resizeMode="cover"
              style={style.cityBackGround}
            >
              <Text style={style.cityName}>{city}</Text>
              <Text style={style.mainTemp}>
                {parseFloat(days[0].temp.day).toFixed()}°
              </Text>
              <Image
                source={mainIcons[getDaysAndNights()][days[0].weather[0].main]}
                resizeMode="contain"
                style={style.mainIcon}
              ></Image>
            </ImageBackground>
          </View>
          <View style={style.waveContainer}>
            <Wave
              style={{ width: SCREEN_WIDTH }}
              H={50}
              waveParams={
                getDaysAndNights() === "day"
                  ? [
                      { A: 50, T: SCREEN_WIDTH * 3, fill: "#e9efff" },
                      { A: 50, T: SCREEN_WIDTH * 2, fill: "#b8ccff" },
                      { A: 50, T: SCREEN_WIDTH, fill: "#ffffff" },
                    ]
                  : [
                      { A: 50, T: SCREEN_WIDTH * 3, fill: "#d7d8d8" },
                      { A: 50, T: SCREEN_WIDTH * 2, fill: "#9d9e9e" },
                      { A: 50, T: SCREEN_WIDTH, fill: "#ffffff" },
                    ]
              }
              animated={true}
              speed={10000}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.weather}
          >
            {days.map(
              (day, index) =>
                index !== 0 && (
                  <View key={index} style={style.day}>
                    <View style={style.week}>
                      <Text>{getDate(day.dt)}</Text>
                      <Fontisto
                        name={icons[day.weather[0].main]}
                        size={40}
                        color="black"
                        style={style.weatherIcons}
                      />
                      <Text style={style.temp}>
                        {parseFloat(day.temp.day).toFixed()}°
                      </Text>
                    </View>
                  </View>
                )
            )}
          </ScrollView>
          <StatusBar />
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  city: {
    flex: 8,
  },
  cityBackGround: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  cityName: {
    fontSize: 22,
    fontWeight: "500",
    paddingTop: 50,
    color: "white",
  },
  weather: {
    backgroundColor: "white",
  },
  day: {
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  loading: {
    paddingHorizontal: 30,
    paddingTop: 40,
    flex: 1,
  },
  loadingIcon: {
    flex: 1,
    justifyContent: "center",
  },
  temp: {
    fontSize: 30,
    marginTop: 10,
  },
  mainTemp: {
    fontSize: 100,
    marginTop: 20,
    color: "white",
  },
  mainIcon: {
    height: SCREEN_HEIGHT / 5,
    width: SCREEN_WIDTH / 2,
  },
  waveContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherIcons: {
    justifyContent: "center",
    marginTop: 15,
  },
  week: {
    alignItems: "center",
    justifyContent: "space-between",
  },
});
