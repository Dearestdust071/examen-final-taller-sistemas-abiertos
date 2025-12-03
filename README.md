Book Tracker Mobile
## Descripción

Cliente móvil para el sistema de gestión de bibliotecas **Book Tracker**, desarrollado con React Native y Expo.

## Prerequisitos

- **Node.js** (versión LTS recomendada)
- **Dispositivo físico** con la aplicación Expo Go instalada o un emulador (Android Studio / Xcode)

## Requerimientos

- Backend PERN en ejecución y accesible desde la red local
- Dispositivo móvil y computadora conectados a la misma red Wi-Fi

## Configuración del Entorno

### 1. Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto móvil:

```bash
npm install
```

### 2. Configuración de la Conexión al Backend

Para que el dispositivo móvil pueda comunicarse con el servidor local, configura la dirección IP privada de tu computadora. `localhost` no funcionará.

**Identificar tu dirección IP Local:**

- **Windows**: Ejecuta `ipconfig` en la terminal y busca "Dirección IPv4" (ej. 192.168.1.50)
- **macOS/Linux**: Ejecuta `ifconfig` o `ip a` en la terminal (ej. 192.168.1.50)

> **Nota**: Al iniciar el backend, la consola suele mostrar esta IP.

**Actualizar el archivo de la API:**

1. Abre el archivo: `src/api/books.ts`
2. Localiza la constante `API_URL`
3. Reemplaza la IP por la tuya manteniendo el puerto (por defecto 4000)

```typescript
const API_URL = 'http://192.168.1.50:4000/api';
```

## Ejecución

### 1. Iniciar el Backend

```bash
npm run dev
```

### 2. Iniciar la App Móvil

```bash
npx expo start --tunnel
```

Escanea el código QR usando Expo Go (Android) o la Cámara (iOS). 

> **Nota**: Probado únicamente en Android.

## Funcionalidades

- **Listado de Inventario**: Visualización de libros y estado (Disponible/Prestado)
- **Escáner de ISBN**: Usa la cámara para buscar libros rápidamente o autocompletar datos al registrar uno nuevo
- **Registro**: Formulario para añadir nuevos libros al catálogo
- **Gestión Rápida**: Botón para Prestar/Devolver libros directamente desde la vista de detalle
