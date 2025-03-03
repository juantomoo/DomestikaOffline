const fs = require("fs");
const path = require("path");

// Función para convertir un archivo SRT a VTT sin eliminar el original
function convertSRTtoVTT(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  // Convertir los tiempos de formato "00:00:01,000" a "00:00:01.000"
  const vttContent = "WEBVTT\n\n" + content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  const newFilePath = filePath.replace(/\.srt$/, ".vtt");
  fs.writeFileSync(newFilePath, vttContent, "utf8");
  return newFilePath;
}

// Opcional: si deseas limpiar un poco el nombre de la carpeta (quitar underscores, dígitos iniciales, etc.)
function cleanFolderName(folderName) {
  // Reemplaza guiones bajos por espacios
  let cleaned = folderName.replace(/_/g, " ");
  // Elimina dígitos/caracteres no alfabéticos iniciales
  cleaned = cleaned.replace(/^[\d\W]+/, "");
  return cleaned;
}

const coursesDir = path.join(__dirname, "cursos");
const outputFile = path.join(__dirname, "files.js");

function getModules(coursePath) {
  return fs.readdirSync(coursePath).map(moduleName => {
    const modulePath = path.join(coursePath, moduleName);
    if (!fs.statSync(modulePath).isDirectory()) return null;
    const videos = fs.readdirSync(modulePath)
      .filter(file => file.endsWith(".mp4"))
      .map(videoFile => {
        // Buscar un archivo SRT que coincida con el nombre base del video
        let subtitleFile = fs.readdirSync(modulePath).find(f =>
          f.endsWith(".srt") && f.startsWith(videoFile.split(".mp4")[0])
        );
        if (subtitleFile) {
          const srtPath = path.join(modulePath, subtitleFile);
          // Convertir SRT a VTT sin eliminar el SRT original
          subtitleFile = convertSRTtoVTT(srtPath);
        }
        return {
          file: path.join("cursos", path.basename(coursePath), moduleName, videoFile),
          subtitle: subtitleFile ? path.join("cursos", path.basename(coursePath), moduleName, path.basename(subtitleFile)) : null
        };
      });
    return { title: moduleName, videos };
  }).filter(Boolean);
}

const courses = fs.readdirSync(coursesDir).map(courseName => {
  // Si quieres usar el nombre de la carpeta tal cual:
  //   course: courseName
  // O si quieres limpiarlo con la función "cleanFolderName":
  return {
    course: cleanFolderName(courseName),
    modules: getModules(path.join(coursesDir, courseName))
  };
});

fs.writeFileSync(outputFile, `const courses = ${JSON.stringify(courses, null, 2)};`);
console.log("Archivo files.js generado correctamente");
