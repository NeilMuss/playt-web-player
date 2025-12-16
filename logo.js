const playIcon = document.getElementById("center-play");

if (playIcon) {
  function pressDown() {
    gsap.to("#center-play", {
      scale: 0.92,
      duration: 0.08,
      ease: "power2.out",
      transformOrigin: "50% 50%"
    });
  }

  function release() {
    gsap.to("#center-play", {
      scale: 1,
      duration: 0.12,
      ease: "power2.out",
      transformOrigin: "50% 50%"
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
