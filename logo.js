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
  gsap.to(spinner, {
    rotation: 270,
    duration: 0.5,
    ease: "power2.out",
    transformOrigin: "50% 50%",
    onComplete: () => {
      // Locked 45 RPM
      gsap.to(spinner, {
        rotation: "+=360",
        duration: 360 / 270, // 1.333s per rotation
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%"
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
