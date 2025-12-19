// ---- State ----
let spinning = false;
let spinTween = null;
let brakeTween = null;

// ---- Elements ----
const playIcon = document.getElementById("center-play");
const spinnerRing = document.getElementById("spinner-ring");

const SPIN_ORIGIN = "75px 75px";

// ---- Press animation (already working) ----
function pressDown() {
  gsap.to(playIcon, {
    scale: 0.92,
    duration: 0.08,
    ease: "power2.out",
    transformOrigin: "50% 50%"
  });
}

function release() {
  gsap.to(playIcon, {
    scale: 1,
    duration: 0.12,
    ease: "power2.out",
    transformOrigin: "50% 50%"
  });
}

// ---- Spin up ----
function startSpin() {
  if (spinning) return;

  spinning = true;

  // Kill any brake in progress
  if (brakeTween) {
    brakeTween.kill();
    brakeTween = null;
  }

  spinTween = gsap.to(spinnerRing, {
    rotation: "+=360",
    duration: 1,
    ease: "none",
    repeat: -1,
    svgOrigin: SPIN_ORIGIN
  });
}

// ---- Brake (the correct way) ----
function stopSpin() {
  if (!spinning || !spinTween) return;

  spinning = false;

  const proxy = { t: spinTween.timeScale() };

  brakeTween = gsap.to(proxy, {
    t: 0,
    duration: 0.6,
    ease: "power2.out",
    onUpdate: () => {
      spinTween.timeScale(proxy.t);
    },
    onComplete: () => {
      spinTween.kill();
      spinTween = null;
      brakeTween = null;
    }
  });
}

// ---- Toggle on logo click ----
playIcon.addEventListener("click", () => {
  pressDown();

  if (spinning) {
    stopSpin();
  } else {
    startSpin();
  }

  setTimeout(release, 100);
});

// ---- Animate logo when playing ----
document.addEventListener("playt:play", () => {
  pressDown();
  startSpin();
  setTimeout(release, 100);
});

document.addEventListener("playt:pause", () => {
  pressDown();
  stopSpin();
  setTimeout(release, 100);
});

// ---- Download intent ----
document.addEventListener("playt:download", () => {
  if (!spinning) startSpin();
  document.dispatchEvent(new Event("playt:play"));
});