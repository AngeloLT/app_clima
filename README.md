la aplicacion ahora consume la api de https://www.weatherapi.com/

### 📝 Resumen de las Modificaciones y Mejoras

A continuación, se detallan las nuevas funcionalidades y mejoras añadidas al código:

---

1. **Importación de `axios` y `Alert`**:

   - Se agregó `axios` para realizar solicitudes HTTP a la API de **WeatherAPI**.
   - Se añadió `Alert` para mostrar mensajes de error.

   **Código:**
   ```js
   import { Alert } from 'react-native';
   import axios from 'axios';
   ```

2. **Declaración de la API Key y URL Base**:

   - Se agregaron constantes para almacenar la clave de la API y la URL base.

   **Código:**
   ```js
   const API_KEY = 'd2bd7effd8c44129a6820730241412';
   const BASE_URL = 'https://api.weatherapi.com/v1';
   ```

3. **Nuevos Estados**:

   - Se añadieron estados para manejar los resultados de búsqueda (`locations`), el clima (`weather`) y el texto del buscador (`query`).

   **Código:**
   ```js
   const [locations, setLocations] = useState([]);
   const [weather, setWeather] = useState(null);
   const [query, setQuery] = useState('');
   ```

4. **Función `searchLocations`**:

   - Busca ciudades en tiempo real a medida que el usuario escribe en el `TextInput`.

   **Código:**
   ```js
   const searchLocations = async (text) => {
     setQuery(text);
     if (text.length > 2) {
       try {
         const response = await axios.get(`${BASE_URL}/search.json?key=${API_KEY}&q=${text}`);
         setLocations(response.data);
       } catch (error) {
         Alert.alert('Error', 'No se pudo obtener los datos de ubicación.');
         console.error(error);
       }
     } else {
       setLocations([]);
     }
   };
   ```

5. **Función `handleLocation`**:

   - Obtiene el clima de la ciudad seleccionada al hacer clic en una opción de la lista de búsqueda.

   **Código:**
   ```js
   const handleLocation = async (location) => {
     try {
       const response = await axios.get(`${BASE_URL}/current.json?key=${API_KEY}&q=${location.name}`);
       setWeather(response.data);
       setLocations([]);
       toggleSearch(false);
       setQuery('');
     } catch (error) {
       Alert.alert('Error', 'No se pudo obtener el clima de la ubicación seleccionada.');
       console.error(error);
     }
   };
   ```

6. **Función `formatDateTime`**:

   - Formatea la fecha y hora de `last_updated` al formato `HH:MM` y `DD/MM/YYYY`.

   **Código:**
   ```js
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
   ```

7. **Mostrar Ícono del Clima**:

   - Se muestra el ícono del clima dinámicamente utilizando la URL proporcionada por la API.

   **Código:**
   ```js
   <Image
     source={{ uri: `https:${weather.current.condition.icon}` }}
     style={tw`w-24 h-24`}
   />
   ```

8. **Mostrar Fecha y Hora Formateadas**:

   - Se utiliza `formatDateTime` para mostrar la hora y fecha formateadas.

   **Código:**
   ```js
   <Text style={tw`text-white font-semibold text-base`}>
     {formatDateTime(weather.current.last_updated).time} |{' '}
     {formatDateTime(weather.current.last_updated).date}
   </Text>
   ```

---

### 📋 Resumen de Mejoras

- **Búsqueda dinámica de ciudades** con `searchLocations` utilizando la API de **WeatherAPI**.
- **Obtención del clima actual** al seleccionar una ciudad con `handleLocation`.
- **Formato amigable** para la fecha y hora con `formatDateTime`.
- **Visualización dinámica del ícono del clima** utilizando `weather.current.condition.icon`.
- **Gestión de errores** con `Alert` para mejorar la experiencia del usuario.

Estas mejoras hacen que la aplicación sea más funcional y ofrezca una experiencia de usuario dinámica y visualmente atractiva. 🌤️📍


![Screenshot 2024-12-13 225534](https://github.com/user-attachments/assets/6ea67415-68e3-4de4-9c65-66fcc3d1913c)

![Screenshot 2024-12-13 225547](https://github.com/user-attachments/assets/dc49b156-2a4b-4b79-b31d-9575f6fcc879)

![Screenshot 2024-12-13 231544](https://github.com/user-attachments/assets/a6c65a75-9775-477a-818b-672eb26beebe)
