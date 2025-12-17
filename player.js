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

  // streaming
  if (bootstrap.streaming && bootstrap.streaming.tracks.length > 0) {
    const track = bootstrap.streaming.tracks[0];

    document.getElementById("track-title").textContent = track.title;

    const audio = document.getElementById("player");
    audio.src = track.url;

    // Safari requires user interaction
    audio.load();
  }

}

main();