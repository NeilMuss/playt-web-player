const playIcon = document.getElementById("center-play");
const spinner = document.getElementById("spinner-ring");

let spinning = false;

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

function startSpin() {
  if (spinning) return;
  spinning = true;

  // Spin-up (torque ramp)
  const SPIN_ORIGIN = "75px 75px";

  gsap.to(spinner, {
    rotation: 270,
    duration: 0.5,
    ease: "power2.out",
    svgOrigin: SPIN_ORIGIN,
    onComplete: () => {
      gsap.to(spinner, {
        rotation: "+=360",
        duration: 360 / 270,
        ease: "none",
        repeat: -1,
        svgOrigin: SPIN_ORIGIN
      });
    }
  });

}

// Desktop
playIcon.addEventListener("mousedown", pressDown);
playIcon.addEventListener("mouseup", () => {
  release();
  startSpin();
});

// Mobile
playIcon.addEventListener("touchstart", pressDown);
playIcon.addEventListener("touchend", () => {
  release();
  startSpin();
});

// Emit intent (do NOT navigate here)
playIcon.addEventListener("click", () => {
  document.dispatchEvent(new Event("playt:play"));
});
