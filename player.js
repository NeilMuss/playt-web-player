async function main() {
  if (window.__playt_initialized) return;
  window.__playt_initialized = true;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("c");
  const openAppBtn = document.getElementById("open-app");
  const previewBtn = document.getElementById("preview-browser");
  const audio = document.getElementById("player");
  const downloadNotice = document.getElementById("download-inline-notice");
  let userChosePreview = false;
  let userInteracted = false;
  let deepLinkAttempted = false;
  let deepLinkTimer = null;

  if (previewBtn) {
    previewBtn.onclick = () => {
      userChosePreview = true;
      userInteracted = true;
      if (deepLinkTimer) {
        clearTimeout(deepLinkTimer);
        deepLinkTimer = null;
      }

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

  const markInteracted = () => {
    userInteracted = true;
  };
  window.addEventListener("pointerdown", markInteracted, { once: true });
  window.addEventListener("touchstart", markInteracted, { once: true });
  window.addEventListener("keydown", markInteracted, { once: true });

  const isIOS = (() => {
    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    return /iPhone|iPad|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  })();

  const maybeAutoAttemptDeepLink = () => {
    if (!isIOS || deepLinkAttempted || userInteracted || userChosePreview) return;
    deepLinkAttempted = true;
    window.location = deepLink;
  };

  // Single automatic attempt on iOS if the user has not interacted.
  deepLinkTimer = window.setTimeout(maybeAutoAttemptDeepLink, 500);

  const bootstrapUrl = `https://playt.info/c/${id}.json`;

  let bootstrap;
  try {
    bootstrap = await fetch(bootstrapUrl).then(r => r.json());
  } catch (err) {
    document.getElementById("title").textContent =
      "Failed to load Playt";
    return;
  }

  const previewTracks = Array.isArray(bootstrap?.streaming?.tracks)
    ? bootstrap.streaming.tracks
    : [];
  const previewAvailable = previewTracks.length > 0;
  const fullPlaytUrl = bootstrap?.content?.source?.url;
  const fullPlaytAvailable = Boolean(fullPlaytUrl);

  if (!previewAvailable && !fullPlaytAvailable) {
    document.getElementById("title").textContent =
      "Failed to load Playt";
    return;
  }

  // Populate metadata
  document.getElementById("title").textContent =
    bootstrap?.release?.title || "Playt";

  document.getElementById("artist").textContent =
    bootstrap?.release?.artist || "";

  // Enable Download button
  const downloadBtn = document.getElementById("download");
  downloadBtn.textContent = "Download Full Playt (.playt)";
  downloadBtn.disabled = !fullPlaytAvailable;

  if (fullPlaytAvailable) {
    if (downloadNotice) {
      downloadNotice.style.display = "none";
    }

    // Respond to explicit download intent
    downloadBtn.onclick = () => {
      document.dispatchEvent(new Event("playt:download"));
    };
  } else {
    downloadBtn.onclick = null;
    if (downloadNotice) {
      downloadNotice.style.display = "block";
    }
  }

  // Actual navigation happens here (logic layer)
  if (fullPlaytAvailable) {
    document.addEventListener("playt:play", () => {
      window.location.href = fullPlaytUrl;
    });
  }

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

  if (previewAvailable) {
    previewTracks.forEach((track, index) => {
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

    if (nextIndex < previewTracks.length) {
      loadTrack(previewTracks[nextIndex], nextIndex);
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
    const tracks = previewTracks;
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
