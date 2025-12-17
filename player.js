async function main() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("c");

  // No cartridge ID present
  if (!id) {
    document.getElementById("title").textContent =
      "No Playt detected";
    return;
  }

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
  downloadBtn.textContent = "Download Playt";
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

  const audio = document.getElementById("player");
  const trackTitle = document.getElementById("track-title");
  const trackListEl = document.getElementById("track-list");
  console.log("before loop:", trackListEl.children.length);


  function loadTrack(track) {
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

      li.onclick = () => loadTrack(track);

      trackListEl.appendChild(li);

      // load first track by default
      if (index === 0) {
        loadTrack(track);
        li.classList.add("active");
      }
    });
  }

  console.log("after loop:", trackListEl.children.length);


}

main();