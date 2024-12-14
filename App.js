import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, TextInput, Alert } from 'react-native';
import tw from 'twrnc';
import { MagnifyingGlassIcon, CalendarDaysIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import React, { useState } from 'react';
import axios from 'axios';

// 👉 API Key de WeatherAPI
const API_KEY = 'd2bd7effd8c44129a6820730241412';
const BASE_URL = 'https://api.weatherapi.com/v1';

export default function App() {
  const [showSearch, toggleSearch] = useState(false); // Estado para mostrar/ocultar el buscador
  const [locations, setLocations] = useState([]); // Estado para almacenar los resultados de búsqueda
  const [weather, setWeather] = useState(null); // Estado para almacenar los datos del clima
  const [query, setQuery] = useState(''); // Estado para almacenar el texto del buscador

  // 📝 Función para buscar ciudades en tiempo real
  const searchLocations = async (text) => {
    setQuery(text); // Actualiza el texto del buscador
    if (text.length > 2) {
      try {
        // 👉 Llama a la API de búsqueda de WeatherAPI
        const response = await axios.get(`${BASE_URL}/search.json?key=${API_KEY}&q=${text}`);
        setLocations(response.data); // Actualiza el estado con los resultados de búsqueda
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener los datos de ubicación.');
        console.error(error);
      }
    } else {
      setLocations([]); // Limpia los resultados si el texto es muy corto
    }
  };

  // 📝 Función para obtener el clima de la ciudad seleccionada
  const handleLocation = async (location) => {
    try {
      // 👉 Llama a la API de clima actual de WeatherAPI
      const response = await axios.get(`${BASE_URL}/current.json?key=${API_KEY}&q=${location.name}`);
      setWeather(response.data); // Guarda los datos del clima en el estado
      setLocations([]); // Limpia los resultados de búsqueda
      toggleSearch(false); // Cierra el buscador
      setQuery(''); // Limpia el texto del buscador
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el clima de la ubicación seleccionada.');
      console.error(error);
    }
  };

    //👉 Función para formatear la fecha y hora
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return {
      time: `${hours}:${minutes}`,      
      date: `${day}/${month}/${year}`, 
    };
  };

  return (
    <View style={tw`flex-1 relative`}>
      <StatusBar style="light" />
      <Image source={require('./assets/images/bg.png')} style={tw`absolute h-full w-full`} blurRadius={70} />
      <SafeAreaView style={tw`flex flex-1`}>
        <View style={tw`mx-4 relative z-50`}>
          {/* 📝 Barra de búsqueda */}
          <View style={tw`flex-row items-center h-12 bg-neutral-300 rounded-full mt-11 justify-between`}>
            {showSearch && (
              <TextInput
                placeholder="Buscar ciudad"
                placeholderTextColor={'gray'}
                style={tw`text-black pl-6 h-10 flex-1 text-base`}
                value={query}
                onChangeText={searchLocations} // 👉 Llama a searchLocations cuando el texto cambia
              />
            )}
            <TouchableOpacity style={tw`rounded-full p-1 m-1 bg-white`} onPress={() => toggleSearch(!showSearch)}>
              <MagnifyingGlassIcon size="25" color="black" />
            </TouchableOpacity>
          </View>

          {/* 📝 Resultados de búsqueda */}
          {locations.length > 0 && showSearch && (
            <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl mt-10`}>
              {locations.map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={tw`flex-row items-center p-3 px-4 border-b-2 border-b-gray-400`}
                  onPress={() => handleLocation(loc)} // 👉 Llama a handleLocation cuando se selecciona una ciudad
                >
                  <MapPinIcon size="20" color="gray" />
                  <Text style={tw`text-black text-lg ml-2`}>{loc.name}, {loc.country}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 📝 Mostrar datos del clima si están disponibles */}
        <View style={tw`flex justify-around flex-1 mb-2`}>
          {weather ? (
            <>
              <Text style={tw`text-white text-center text-2xl font-bold`}>
                {weather.location.name},{' '}
                <Text style={tw`text-lg font-semibold text-gray-300`}>{weather.location.country}</Text>
              </Text>
              <View style={tw`flex-row justify-center`}>
                <Image source={require('./assets/images/partlycloudy.png')} style={tw`w-40 h-40`} />
              </View>
              <View style={tw`space-y-2`}>
                <Text style={tw`text-center text-6xl text-white ml-5`}>{weather.current.temp_c}°</Text>
                <Text style={tw`text-center text-white ml-5 tracking-widest`}>
                  {weather.current.condition.text}
                </Text>
              <View style={tw`flex-row justify-center`}>
                <Image
                  source={{ uri: `https:${weather.current.condition.icon}` }} 
                  style={tw`w-24 h-24`}
                />
              </View>
              </View>
              <View style={tw`flex-row justify-between mx-4`}>
                <View style={tw`flex-row space-x-2 items-center`}>
                  <Image source={require('./assets/icons/wind.png')} style={tw`h-6 w-6`} />
                  <Text style={tw`text-white font-semibold text-base`}>{' '}{weather.current.wind_kph} Km/h</Text>
                </View>
                <View style={tw`flex-row space-x-2 items-center`}>
                  <Image source={require('./assets/icons/drop.png')} style={tw`h-6 w-6`} />
                  <Text style={tw`text-white font-semibold text-base`}>{' '}{weather.current.humidity}%</Text>
                </View>
                <View style={tw`flex-row space-x-2 items-center`}>
                  <Image source={require('./assets/icons/sun.png')} style={tw`h-6 w-6`} />
                  <Text style={tw`text-white font-semibold text-base`}>
                  {' '}{formatDateTime(weather.current.last_updated).time} |{' '}
                    {formatDateTime(weather.current.last_updated).date}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={tw`text-white text-center text-lg`}>Busca una ciudad para ver el clima</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
