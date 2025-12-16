const playIcon = document.getElementById("center-play");
const spinner = document.getElementById("spinner-ring");

let spinning = false;
let spinTween = null;

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

  spinTween = gsap.to("#spinner-ring", {
    rotation: "+=360",
    duration: 1,
    ease: "none",
    repeat: -1,
    svgOrigin: "75px 75px"
  });

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

function stopSpin() {
  if (!spinning || !spinTween) return;

  spinning = false;

  gsap.to(spinTween, {
    timeScale: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => {
      spinTween.kill();
      spinTween = null;
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

// Logo interaction: spin only
playIcon.addEventListener("click", () => {
  if (spinning) {
    stopSpin();
  } else {
    startSpin();
  }
});

// Download intent: spin + notify app
document.addEventListener("playt:download", () => {
  startSpin();
  document.dispatchEvent(new Event("playt:play"));
});

