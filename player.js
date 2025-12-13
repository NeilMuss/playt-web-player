async function main() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("c");

  if (!id) {
    document.getElementById("title").textContent =
      "No Playt detected";
    return;
  }

  const bootstrapUrl =
    `https://playt.info/c/${id}.json`;

  const bootstrap = await fetch(bootstrapUrl).then(r => r.json());

  document.getElementById("title").textContent =
    bootstrap.release.title;

  document.getElementById("artist").textContent =
    bootstrap.release.artist;

  const playBtn = document.getElementById("play");
  playBtn.textContent = "Download Playt";
  playBtn.disabled = false;

  playBtn.onclick = () => {
    window.location.href = bootstrap.content.source.url;
  };
}

main();

