const playIcon = document.getElementById("center-play");

if (playIcon) {
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

  // Desktop
  playIcon.addEventListener("mousedown", pressDown);
  playIcon.addEventListener("mouseup", release);
  playIcon.addEventListener("mouseleave", release);

  // Mobile
  playIcon.addEventListener("touchstart", pressDown);
  playIcon.addEventListener("touchend", release);
}
