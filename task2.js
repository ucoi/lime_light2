/* task2.js
   Modernized parallax controller using requestAnimationFrame.
   Works without jQuery and keeps simple data-speed attributes.
*/

(function () {
  // Readables
  const layers = Array.from(document.querySelectorAll(".layer"));
  const objects = Array.from(document.querySelectorAll(".obj"));
  const rocks = Array.from(document.querySelectorAll(".rock"));
  const allParallax = layers.concat(objects, rocks);

  // store initial positions (we'll apply transforms relative to these)
  const initial = new Map();
  allParallax.forEach((el) => {
    // get current bounding offsets
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    initial.set(el, { top, left });
  });

  // cursor parallax variables
  let mouseX = 0,
    mouseY = 0;
  const windowW = () =>
    window.innerWidth || document.documentElement.clientWidth;
  const windowH = () =>
    window.innerHeight || document.documentElement.clientHeight;

  // scroll position
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  // smooth lerp helper
  function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

  // event listeners: track mouse and scroll
  window.addEventListener("mousemove", (e) => {
    // normalized -0.5 .. 0.5
    mouseX = e.clientX / windowW() - 0.5;
    mouseY = e.clientY / windowH() - 0.5;
  });

  window.addEventListener(
    "scroll",
    () => {
      lastScrollY = window.scrollY || window.pageYOffset;
      requestTick();
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    // recompute initial positions if the layout changes
    allParallax.forEach((el) => {
      const rect = el.getBoundingClientRect();
      initial.set(el, {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    });
  });

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  // main RAF update
  function update() {
    ticking = false;
    const scrolled = lastScrollY;

    // apply to layers
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed || 0.2);
      // translateY negative -> move up as we scroll down (classic parallax)
      const y = scrolled * -speed;
      // subtle mouse offset
      const mx = mouseX * 40 * speed; // scale by speed for depth
      const my = mouseY * 30 * speed;
      layer.style.transform = `translate3d(${mx}px, ${y + my}px, 0)`;
    });

    // apply to objects and rocks
    objects.forEach((obj) => {
      const speed = parseFloat(obj.dataset.speed || 0.5);
      const y = scrolled * -speed;
      const mx = mouseX * 80 * speed;
      const my = mouseY * 50 * speed;
      // add a small rotation for variety
      const rot = mouseX * 3 * speed;
      obj.style.transform = `translate3d(${mx}px, ${
        y + my
      }px, 0) rotate(${rot}deg)`;
    });

    rocks.forEach((r) => {
      const speed = parseFloat(r.dataset.speed || 0.5);
      const y = scrolled * -speed;
      const mx = mouseX * 40 * (speed * 0.5);
      r.style.transform = `translate3d(${mx}px, ${y}px, 0)`;
    });

    // keep RAF running for continuous mouse-based subtle motion
    requestAnimationFrame(update);
  }

  // Start the loop
  requestTick();
})();
