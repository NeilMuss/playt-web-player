async function main() {
  if (window.__playt_initialized) return;
  window.__playt_initialized = true;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("c");
  const openAppBtn = document.getElementById("open-app");
  const previewBtn = document.getElementById("preview-browser");
  const audio = document.getElementById("player");

  if (previewBtn) {
    previewBtn.onclick = () => {
      const audioContainer = document.getElementById("audio-container");
      if (audioContainer) {
        audioContainer.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (audio) {
        audio.focus();
      }
    };
  }

  // No cartridge ID present
  if (!id) {
    document.getElementById("title").textContent =
      "No Playt detected";
    return;
  }

  const deepLink = `playt://load?c=${encodeURIComponent(id)}`;

  // iOS may block automatic custom-scheme navigation unless user interacts.
  // Show a clear fallback button that retries the deep link on tap.
  if (openAppBtn) {
    openAppBtn.style.display = "block";
    openAppBtn.onclick = () => {
      window.location = deepLink;
    };
  }

  // Single automatic attempt on page load.
  window.location = deepLink;

  const bootstrapUrl = `https://playt.info/c/${id}.json`;

  let bootstrap;
  try {
    bootstrap = await fetch(bootstrapUrl).then(r => r.json());
  } catch (err) {
    document.getElementById("title").textContent =
      "Failed to load Playt";
    return;
  }

  // Populate metadata
  document.getElementById("title").textContent =
    bootstrap.release.title;

  document.getElementById("artist").textContent =
    bootstrap.release.artist;

  // Enable Download button
  const downloadBtn = document.getElementById("download");
  downloadBtn.textContent = "Download Full Playt (.playt)";
  downloadBtn.disabled = false;

  // Respond to explicit download intent
  downloadBtn.onclick = () => {
    document.dispatchEvent(new Event("playt:download"));
  };

  // Actual navigation happens here (logic layer)
  document.addEventListener("playt:play", () => {
    window.location.href = bootstrap.content.source.url;
  });

  // artwork
  if (bootstrap.artwork && bootstrap.artwork.url) {
    document.getElementById("art").src = bootstrap.artwork.url;
  }

  const trackTitle = document.getElementById("track-title");
  const trackListEl = document.getElementById("track-list");
  trackListEl.innerHTML = "";

  let currentTrackIndex = 0;

  function loadTrack(track, index) {
    currentTrackIndex = index;
    trackTitle.textContent = track.title;
    audio.src = track.url;
    audio.load();

    [...trackListEl.children].forEach(li =>
      li.classList.toggle("active", li.dataset.url === track.url)
    );
  }

  if (bootstrap.streaming && bootstrap.streaming.tracks.length > 0) {
    bootstrap.streaming.tracks.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = `${track.track}. ${track.title}`;
      li.dataset.url = track.url;

      li.onclick = () => loadTrack(track, index);

      trackListEl.appendChild(li);

      // load first track by default
      if (index === 0) {
        loadTrack(track, index);
        li.classList.add("active");
      }

    });
  }

  audio.addEventListener("ended", () => {
    const nextIndex = currentTrackIndex + 1;

    if (nextIndex < bootstrap.streaming.tracks.length) {
      loadTrack(bootstrap.streaming.tracks[nextIndex], nextIndex);
      audio.play(); // user already interacted
    }
  });

  const playButton = document.getElementById("center-play");

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    document.dispatchEvent(new Event("playt:play"));
  });

  audio.addEventListener("pause", () => {
    document.dispatchEvent(new Event("playt:pause"));
  });

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  function playIndex(index) {
    const tracks = bootstrap.streaming.tracks;
    if (index < 0 || index >= tracks.length) return;

    loadTrack(tracks[index], index);
    audio.play();
  }

  prevBtn.addEventListener("click", () => {
    playIndex(currentTrackIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    playIndex(currentTrackIndex + 1);
  });

}

main();
