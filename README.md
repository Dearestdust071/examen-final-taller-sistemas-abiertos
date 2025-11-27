# Book Tracker Mobile

Cliente móvil para el sistema de gestión de bibliotecas Book Tracker, construido con React Native y Expo.

## Requisitos 

* Node.js (LTS recomendado)
* Dispositivo físico con la app **Expo Go** 
* Backend PERN en ejecución.

## Configuración

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar conexión al Backend:**
    * Abre el archivo `src/api/books.ts`.
    * Busca la constante `API_URL`.
    * Reemplaza `192.168.1.X` con la dirección IP local de tu computadora (no usar `localhost` si pruebas en dispositivo físico).
    * Asegúrate de que el backend esté corriendo en el puerto 4000 (o el que hayas configurado).

## ▶Ejecución

1.  **Iniciar el Backend:**
    Desde la carpeta del servidor:
    ```bash
    npm run dev
    ```

2.  **Iniciar la App Móvil:**
    Desde la carpeta del cliente móvil:
    ```bash
    npx expo start
    ```
    * Escanea el código QR con Expo Go (Android) o la app de Cámara (iOS).
    * O presiona `a` para abrir en emulador Android, `i` para simulador iOS.

## Funcionalidades

* **Listado:** Visualización de libros y su disponibilidad.
* **Escáner:** Búsqueda rápida o pre-llenado de formulario mediante código de barras ISBN (Cámara).
* **Registro:** Creación de nuevos libros.
* **Gestión Rápida:** Cambio de estado de disponibilidad desde la lista.