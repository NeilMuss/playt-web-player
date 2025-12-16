const spinner = document.getElementById("spinner-ring");
const playIcon = document.getElementById("center-play");

let spinning = false;

function pressDown() {
  gsap.to(playIcon, {
    scale: 0.92,
    duration: 0.08,
    ease: "power2.out"
  });
}

function release() {
  gsap.to(playIcon, {
    scale: 1,
    duration: 0.12,
    ease: "power2.out"
  });
}

function startSpin() {
  if (spinning) return;
  spinning = true;

  gsap.to(spinner, {
    rotation: 270,
    duration: 0.5,
    ease: "power2.out",
    transformOrigin: "50% 50%",
    onComplete: () => {
      gsap.to(spinner, {
        rotation: "+=360",
        duration: 360 / 270,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%"
      });
    }
  });
}

// Desktop
playIcon.addEventListener("mousedown", pressDown);
playIcon.addEventListener("mouseup", release);

// Mobile
playIcon.addEventListener("touchstart", pressDown);
playIcon.addEventListener("touchend", release);

// Click = intent (but NOT navigation yet)
playIcon.addEventListener("click", () => {
  startSpin();

  // Tell the rest of the app “play was requested”
  document.dispatchEvent(new Event("playt:play"));
});

