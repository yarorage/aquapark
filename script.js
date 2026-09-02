// Animated water waves background
(function () {
  const canvas = document.getElementById("waves");
  const ctx = canvas.getContext("2d");
  let w, h;
  const layers = [];
  const palettes = [
    ["rgba(67,230,201,", "rgba(126,224,255,"],
    ["rgba(25,110,150,", "rgba(15,60,95,"],
    ["rgba(255,122,168,", "rgba(67,230,201,"]
  ];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    layers.length = 0;
    for (let i = 0; i < 6; i++) {
      const pal = palettes[i % palettes.length];
      layers.push({
        y0: h * (0.25 + Math.random() * 0.6),
        amp: 30 + Math.random() * 55,
        freq: 0.0012 + Math.random() * 0.0018,
        speed: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.06 + Math.random() * 0.08,
        color: pal[i % 2],
        points: 60
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    layers.forEach((L) => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += w / L.points) {
        const y = L.y0 + Math.sin(x * L.freq + time * L.speed + L.phase) * L.amp
          + Math.sin(x * L.freq * 2.3 + time * L.speed * 1.4) * L.amp * 0.4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, L.y0 - 120, 0, L.y0 + 80);
      grad.addColorStop(0, L.color + "0)");
      grad.addColorStop(1, L.color + (L.alpha) + ")");
      ctx.fillStyle = grad;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

// Navbar scrolled state
(function () {
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });
})();

// Mobile menu
(function () {
  const burger = document.getElementById("burger");
  const menu = document.querySelector(".menu");
  burger.addEventListener("click", () => {
    menu.classList.toggle("open");
    burger.classList.toggle("active");
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
})();

// Lightbox for gallery (real photos from socials)
(function () {
  const lb = document.getElementById("lightbox");
  const img = lb.querySelector("img");
  const close = lb.querySelector(".lb-close");
  const photos = document.querySelectorAll(".photo");
  photos.forEach((ph) => {
    ph.addEventListener("click", () => {
      const bg = ph.querySelector(".ph").style.backgroundImage;
      const m = bg.match(/url\(["']?(.+?)["']?\)/);
      img.src = m ? m[1] : "media/telegram-cover.jpg";
      lb.classList.add("open");
    });
  });
  close.addEventListener("click", () => lb.classList.remove("open"));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.classList.remove("open");
  });
})();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
