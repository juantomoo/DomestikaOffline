# Domestika Offline Player

**Domestika Offline Player** es una aplicación web diseñada para reproducir cursos descargados de Domestika de forma offline. Esta versión ha sido actualizada para incluir una interfaz personalizada con navegación superior, un overlay informativo, controles de video personalizados (con volumen, subtítulos, pantalla completa, etc.), desplazamiento horizontal para módulos y playlist, y otras mejoras.

Además, este reproductor se integra perfectamente con los videos descargados mediante [domestika-downloader](https://github.com/ReneR97/domestika-downloader).

---

## Características Actualizadas

- **Interfaz de Usuario Personalizada:**  
  - **Barra Superior:** Muestra la navegación de cursos y módulos.  
  - **Overlay de Texto:** Indica el curso, módulo y lección actual sobre el video.
- **Controles Personalizados en la Barra Inferior:**  
  - Botones para reproducir, pausar, ir al video anterior o siguiente.
  - **Control de Volumen Vertical:** Aparece al pasar el cursor sobre el ícono de volumen y permite ajustar el volumen sin perder el enfoque.
  - Botón para activar/desactivar subtítulos.
  - Botón de pantalla completa que activa el modo fullscreen para todo el documento, manteniendo la interfaz personalizada.
  - Desplazamiento horizontal con la rueda del ratón para los módulos y la playlist.
- **Integración con Material Icons:** Se utilizan íconos de Material Icons para una apariencia moderna.
- **Soporte Offline:** Al descargar y alojar localmente todas las fuentes y archivos (por ejemplo, Material Icons o Poppins si se prefiere), la aplicación funcionará sin conexión.

---

## Integración con Domestika-downloader

La integración con [domestika-downloader](https://github.com/ReneR97/domestika-downloader) es muy sencilla:

1. **Descarga de Cursos:**  
   Usa [domestika-downloader](https://github.com/ReneR97/domestika-downloader) para descargar los cursos de Domestika. Este script organizará los videos y los archivos de subtítulos en una estructura de carpetas, donde cada curso tiene su propio directorio y cada módulo está dentro de él.

2. **Estructura de Carpetas:**  
   La estructura típica será similar a:
   ```
   /domestika-player/
   ├── index.html
   ├── domestika_styles.css
   ├── script.js
   ├── generate_files.js    (Script Node.js para generar files.js)
   ├── files.js             (Generado automáticamente)
   └── cursos/
         ├── Curso1/
         │    ├── Módulo1/
         │    │     ├── video1.mp4
         │    │     ├── subtitulo1.srt
         │    │     └── video2.mp4
         │    └── Módulo2/
         │          └── video3.mp4
         └── Curso2/
              └── ...
   ```

3. **Generación de files.js:**  
   Ejecuta el script Node.js `generate_files.js` que analiza la estructura de la carpeta `cursos/` y genera un archivo `files.js` con la información de los cursos, módulos y videos. Este archivo se incluye en el HTML y es el que la aplicación utiliza para construir dinámicamente la interfaz.

4. **Ejecución de la Aplicación:**  
   Una vez que tengas la estructura de carpetas con los cursos y que `files.js` esté generado, abre `index.html` en un servidor web local (por ejemplo, usando [http-server](https://www.npmjs.com/package/http-server)) para que la aplicación funcione correctamente. La aplicación cargará los cursos y módulos, y podrás navegar por las lecciones y reproducir los videos offline.

---

## Pasos para Configurar y Ejecutar la Aplicación

1. **Clonar el Repositorio del Reproductor:**  
   Descarga o clona el repositorio del reproductor (este proyecto).

2. **Integrar Domestika-downloader:**  
   Descarga los cursos utilizando [domestika-downloader](https://github.com/ReneR97/domestika-downloader) y coloca la carpeta `cursos/` resultante en la raíz del proyecto.

3. **Generar files.js:**  
   Ejecuta en la terminal:
   ```sh
   node generate_files.js
   ```
   Esto creará el archivo `files.js` con la estructura necesaria.

4. **Configurar Fuentes y Recursos:**  
   - Si deseas que la aplicación funcione offline, descarga las fuentes de Material Icons y Poppins y actualiza las rutas en el `index.html` y `domestika_styles.css`.
   - Asegúrate de que la estructura de carpetas de los cursos coincida con la esperada.

5. **Ejecutar la Aplicación:**  
   Inicia un servidor web local:
   ```sh
   http-server .
   ```
   Luego abre `http://localhost:8080` en tu navegador.

---

## Resumen de Cambios Realizados

- **Interfaz Personalizada:** Se ha mantenido y mejorado la navegación, overlay y playlist.
- **Controles Personalizados:** Se añadieron botones con Material Icons, un control de volumen vertical (con área de influencia ampliada), y se agregó la capacidad de desplazamiento horizontal con la rueda del ratón en módulos y playlist.
- **Pantalla Completa:** Se configuró para que al activarse, se solicite fullscreen para todo el documento, manteniendo la interfaz completa sin que aparezcan los controles nativos.
- **Integración con files.js:** La aplicación utiliza `files.js` generado por `generate_files.js` para cargar dinámicamente los cursos y módulos descargados con domestika-downloader.

---
