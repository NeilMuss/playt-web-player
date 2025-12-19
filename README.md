# OpenPlayt Web Player

The **OpenPlayt Web Player** is a lightweight, data-driven web audio player designed to work with **Playt** cartridges — physical NFC-enabled objects that point to music releases hosted on the open web.

A Playt is not an app, not DRM, and not a streaming service.
It’s a *physical album* that happens to use modern web primitives.

This player is the reference implementation for how a phone should respond when someone taps a Playt.

---

## ✨ What This Player Does

When opened with a Playt cartridge ID:

- Fetches a **bootstrap JSON** describing the release
- Displays album metadata and artwork
- Streams tracks directly from open storage (e.g. Arweave)
- Plays tracks sequentially (album-style)
- Supports:
  - Play / Pause
  - Next / Previous track
  - Track list selection
- Animates the Playt logo in response to playback
- Provides an explicit **Download Playt** action

No accounts.  
No tracking.  
No lock-in.

---

## 🧱 Architecture Overview

The player is intentionally simple and modular:

NFC Tag
↓
playt.info redirect
↓
playt-app.com/?c=<id>
↓
Bootstrap JSON (openplayt-bootstrap-1.0)
↓
Generic Web Player

### Key design principles

- **Data-driven**: the player contains no album-specific logic
- **Stateless**: everything important comes from the bootstrap JSON
- **Event-based**: UI components communicate via semantic events
- **Safari-safe**: respects iOS autoplay and gesture rules
- **Host-agnostic**: works with any static hosting provider

---

## 📁 Repository Structure

```
├── index.html # Player shell
├── style.css # Layout and typography
├── player.js # Playback + album logic
├── logo.js # Playt logo animation
└── README.md`
```

---

## 🔊 Playback Model

- Audio is streamed using the native `<audio>` element
- Supported formats depend on the browser (MP3 recommended)
- Auto-advance plays the album straight through
- User interaction unlocks playback on Safari/iOS

---

## 🎛 Controls

- **Center Play icon**: Play / Pause
- **Track list**: Jump to any track
- **◀︎ / ▶︎ buttons**: Previous / Next track
- **Download Playt**: Explicit download intent (no surprise downloads)

---

## 🌀 Logo Animation

The Playt logo is animated independently of the player logic.

The player emits semantic events:

- `playt:play`
- `playt:pause`
- `playt:download`

The logo listens for these events and animates accordingly.

This separation keeps playback logic clean and allows the logo to evolve visually without touching the player.

---

## 📦 Bootstrap JSON Format

The player expects a JSON document following the
`openplayt-bootstrap-1.0` spec.

Example (simplified):

```json
{
  "spec": "openplayt-bootstrap-1.0",
  "release": {
    "artist": "Bessie Smith",
    "title": "Giants of Jazz – Disc 1",
    "year": "1926–1928"
  },
  "artwork": {
    "url": "https://arweave.net/..."
  },
  "streaming": {
    "format": "mp3",
    "tracks": [
      { "track": 1, "title": "Dipper Mouth Blues", "url": "..." }
    ]
  }
}
```

The player does not assume:
a specific host
a specific storage network
a specific licensing model


## 🚀 Hosting
This player is designed for static hosting.
Known working setups:
- Netlify
- GitHub Pages
- Cloudflare Pages

No build step required.

## 🧪 Development Notes
Clear caches aggressively when updating JSON
Version or timestamp your bootstrap files during iteration
Safari requires a user gesture before audio.play()
CORS headers must allow the player origin to fetch JSON
## 🧭 Project Status
This is an actively evolving reference implementation.
Planned enhancements:

- Disc / side navigation
- Commentary tracks
- Offline caching (PWA-lite)
- Visual state variations for different Playt types

The goal is not to build the player, 
but to define how Playts behave.
## 📜 License
This project is open source.
Use it.
Fork it.
Embed it.
Print it.
Put it in an object.

Just don’t turn it into surveillance.

## ❤️ A Note on Intent
Playt exists because albums deserve to be objects again.
This player is deliberately:

- small
- legible
- remixable
- respectful of the listener

If you’re building something strange, physical, or generous —
you’re probably using it right.