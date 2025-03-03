(function() {
    // Elementos de navegación y reproducción
    const courseRow = document.getElementById("nav-courses");
    const moduleRow = document.getElementById("nav-modules");
    const videoPlayer = document.getElementById("video-player");
    const track = document.getElementById("video-subtitles");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const playlistContainer = document.getElementById("playlist");
    const videoTitleElement = document.getElementById("video-title"); // Si existe, se oculta al seleccionar módulo

    // Elementos del overlay de texto
    const overlayCourse = document.getElementById("overlay-course");
    const overlayModule = document.getElementById("overlay-module");
    const overlayLesson = document.getElementById("overlay-lesson");
    const overlayText = document.getElementById("video-overlay-text");

    // Elementos de las barras de navegación
    const topBar = document.querySelector(".top-bar");
    const bottomBar = document.querySelector(".bottom-bar");

    // Controles personalizados (ubicados en la barra inferior)
    const playPauseButton = document.getElementById("play-pause");
    const muteToggle = document.getElementById("mute-toggle");
    const fullscreenToggle = document.getElementById("fullscreen-toggle");
    const subtitleToggle = document.getElementById("subtitle-toggle");
    const volumeSlider = document.getElementById("volume-slider");

    let currentVideos = [];
    let currentIndex = 0;
    let navTimeout;
    let overlayTimeout;

    // 1. Llenar la fila de cursos
    courses.forEach((course, cIndex) => {
      const courseItem = document.createElement("div");
      courseItem.className = "nav-item";
      courseItem.textContent = course.course;
      courseItem.onclick = () => selectCourse(cIndex);
      courseRow.appendChild(courseItem);
    });

    // 2. Al seleccionar un curso, llenar la fila de módulos y actualizar overlay
    function selectCourse(courseIndex) {
      Array.from(courseRow.children).forEach(el => el.classList.remove("active"));
      courseRow.children[courseIndex].classList.add("active");
      overlayCourse.textContent = courses[courseIndex].course;

      moduleRow.innerHTML = "";
      const selectedCourse = courses[courseIndex];
      selectedCourse.modules.forEach((mod, mIndex) => {
        const modItem = document.createElement("div");
        modItem.className = "nav-item";
        modItem.textContent = mod.title;
        modItem.onclick = () => selectModule(courseIndex, mIndex);
        moduleRow.appendChild(modItem);
      });
    }

    // 3. Al seleccionar un módulo, actualizar overlay, playlist y reproducir
    function selectModule(courseIndex, moduleIndex) {
      Array.from(moduleRow.children).forEach(el => el.classList.remove("active"));
      moduleRow.children[moduleIndex].classList.add("active");
      const selectedModule = courses[courseIndex].modules[moduleIndex];
      overlayModule.textContent = selectedModule.title;

      currentVideos = selectedModule.videos;
      currentIndex = 0;

      updatePlaylist();
      playVideo(currentVideos[currentIndex]);

      // Ocultar el mensaje "Selecciona un módulo", si existe
      if (videoTitleElement) {
        videoTitleElement.style.display = "none";
      }
    }

    // 4. Reproducir video y actualizar overlay con el nombre de la lección, activando subtítulos
    function playVideo(video) {
      videoPlayer.src = video.file;
      if (video.subtitle) {
        track.src = video.subtitle;
        // Forzar la carga para actualizar el textTrack
        videoPlayer.load();
        if (videoPlayer.textTracks && videoPlayer.textTracks.length > 0) {
          videoPlayer.textTracks[0].mode = "showing";
        }
      } else {
        track.src = "";
        if (videoPlayer.textTracks && videoPlayer.textTracks.length > 0) {
          videoPlayer.textTracks[0].mode = "disabled";
        }
      }
      videoPlayer.play();

      let baseName = video.file
        .replace(/[\\|]/g, "/")
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "")
        .replace(/^[\d\W]+/, "");
      overlayLesson.textContent = baseName;

      updatePlaylistHighlight();
      // Ocultar automáticamente las barras al iniciar la reproducción
      hideNavBars();
    }

    // 5. Botones de Anterior / Siguiente
    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        playVideo(currentVideos[currentIndex]);
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentIndex < currentVideos.length - 1) {
        currentIndex++;
        playVideo(currentVideos[currentIndex]);
      }
    });

    // 6. Generar la playlist en el footer
    function updatePlaylist() {
      playlistContainer.innerHTML = "";
      currentVideos.forEach((video, index) => {
        const item = document.createElement("div");
        item.className = "playlist-item";
        let baseName = video.file
          .replace(/[\\|]/g, "/")
          .split("/")
          .pop()
          .replace(/\.[^/.]+$/, "")
          .replace(/^[\d\W]+/, "");
        item.textContent = baseName;
        item.onclick = () => {
          currentIndex = index;
          playVideo(currentVideos[currentIndex]);
        };
        playlistContainer.appendChild(item);
      });
      updatePlaylistHighlight();
    }

    // 7. Resaltar el video en reproducción en la playlist
    function updatePlaylistHighlight() {
      const items = playlistContainer.querySelectorAll(".playlist-item");
      items.forEach((item, idx) => {
        item.classList.toggle("active", idx === currentIndex);
      });
    }

    // ----------------------------------------------------------
    // Controles personalizados del video (ubicados en la barra inferior)
    // ----------------------------------------------------------
    if (playPauseButton) {
      playPauseButton.addEventListener("click", () => {
        if (videoPlayer.paused) {
          videoPlayer.play();
        } else {
          videoPlayer.pause();
        }
      });
      videoPlayer.addEventListener("play", () => {
        playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
      });
      videoPlayer.addEventListener("pause", () => {
        playPauseButton.innerHTML = '<i class="material-icons">play_arrow</i>';
      });
    }

    if (muteToggle) {
      muteToggle.addEventListener("click", () => {
        videoPlayer.muted = !videoPlayer.muted;
        muteToggle.innerHTML = videoPlayer.muted
          ? '<i class="material-icons">volume_off</i>'
          : '<i class="material-icons">volume_up</i>';
      });
    }

    // Actualizar el volumen cuando se mueva el slider
    if (volumeSlider) {
      volumeSlider.addEventListener("input", () => {
        videoPlayer.volume = volumeSlider.value;
        if (videoPlayer.volume == 0) {
          muteToggle.innerHTML = '<i class="material-icons">volume_off</i>';
        } else {
          muteToggle.innerHTML = '<i class="material-icons">volume_up</i>';
        }
      });
    }

    if (fullscreenToggle) {
      fullscreenToggle.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fullscreenToggle.innerHTML = '<i class="material-icons">fullscreen</i>';
        } else {
          // Solicitar pantalla completa para todo el documento para mantener la interfaz
          document.documentElement.requestFullscreen();
          fullscreenToggle.innerHTML = '<i class="material-icons">fullscreen_exit</i>';
        }
      });
    }

    if (subtitleToggle) {
      subtitleToggle.addEventListener("click", () => {
        const textTrack = videoPlayer.textTracks[0];
        if (textTrack) {
          if (textTrack.mode === "showing") {
            textTrack.mode = "disabled";
            subtitleToggle.innerHTML = '<i class="material-icons" style="opacity:0.5;">closed_caption</i>';
          } else {
            textTrack.mode = "showing";
            subtitleToggle.innerHTML = '<i class="material-icons">closed_caption</i>';
          }
        }
      });
    }

    // ----------------------------------------------------------
    // Auto-ocultamiento de las barras de navegación (top & bottom)
    // ----------------------------------------------------------
    function showNavBars() {
      topBar.style.opacity = "1";
      bottomBar.style.opacity = "1";
      if (navTimeout) clearTimeout(navTimeout);
      navTimeout = setTimeout(() => {
        hideNavBars();
      }, 3000);
    }
    function hideNavBars() {
      topBar.style.opacity = "0";
      bottomBar.style.opacity = "0";
    }
    document.addEventListener("mousemove", showNavBars);
    document.addEventListener("keydown", showNavBars);
    showNavBars();

    // ----------------------------------------------------------
    // Auto-ocultamiento del overlay de texto
    // ----------------------------------------------------------
    function showOverlay() {
      overlayText.style.opacity = "1";
      if (overlayTimeout) clearTimeout(overlayTimeout);
      overlayTimeout = setTimeout(() => {
        overlayText.style.opacity = "0";
      }, 3000);
    }
    document.addEventListener("mousemove", showOverlay);
    document.addEventListener("keydown", showOverlay);
    showOverlay();

    // ----------------------------------------------------------
    // Desplazamiento horizontal con la rueda del ratón en módulos y playlist
    // ----------------------------------------------------------
    if (moduleRow) {
      moduleRow.addEventListener("wheel", (e) => {
        e.preventDefault();
        moduleRow.scrollLeft += e.deltaY;
      });
    }
    if (playlistContainer) {
      playlistContainer.addEventListener("wheel", (e) => {
        e.preventDefault();
        playlistContainer.scrollLeft += e.deltaY;
      });
    }
})();
