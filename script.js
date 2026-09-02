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
      img.src = m ? m[1] : "media/fotos/photo_2024-07-19_20-34-51.jpg";
      lb.classList.add("open");
    });
  });
  close.addEventListener("click", () => lb.classList.remove("open"));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.classList.remove("open");
  });
})();

// Video swap: клик по маленькому видео меняет его местами с большим (оно становится большим и воспроизводится)
(function () {
  const thumbsWrap = document.querySelector(".video-thumbs");

  function vidData(src) {
    const m = src.match(/embed\/([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : "r74AuFF2B7c";
  }

  function makePlayer(id, title) {
    return (
      '<iframe id="mainPlayer" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + title + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
    );
  }

  function makeThumb(id, title) {
    var fig = document.createElement("figure");
    fig.className = "video small";
    fig.dataset.video = id;
    fig.dataset.title = title;
    fig.innerHTML =
      '<button class="video-pick" aria-label="Смотреть ' + title + '">' +
      '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="' + title + '" loading="lazy" />' +
      '<span class="video-playbadge">▶</span>' +
      "</button><figcaption class='video-cap'></figcaption>";
    return fig;
  }

  // Делегирование кликов по всем маленьким видео (в том числе создаваемым динамически)
  thumbsWrap.addEventListener("click", function (e) {
    const thumbEl = e.target.closest(".video.small");
    if (!thumbEl) return;
    const v = thumbEl.dataset.video;
    const t = thumbEl.dataset.title;
    if (!v) return;

    const currentBig = document.getElementById("bigVideo");
    const currentIFrame = currentBig.querySelector("iframe");
    const prevId = vidData(currentIFrame.src);
    const prevTitle = currentBig.querySelector(".video-cap").textContent;

    // Строим большим выбранное видео (скрыто до конца fade-out)
    const newBig = document.createElement("figure");
    newBig.className = "video large entering";
    newBig.id = "bigVideo";
    newBig.innerHTML =
      '<div class="video-embed">' + makePlayer(v, t) + "</div><figcaption class='video-cap'></figcaption>";
    newBig.querySelector(".video-cap").textContent = t;

    // Строим маленькое превью из прежнего большого
    const newSmall = makeThumb(prevId, prevTitle);

    // Плавная смена: сначала fade-out старого, затем обмен DOM и fade-in нового
    let moved = false;
    function doSwap() {
      if (moved) return;
      moved = true;
      currentBig.replaceWith(newBig);
      thumbEl.replaceWith(newSmall);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        newBig.classList.remove("entering");
      }));
    }

    if (currentBig.classList.contains("swapping-out")) {
      doSwap();
    } else {
      currentBig.classList.add("swapping-out");
      // после fade-out .22s меняем местами
      setTimeout(doSwap, 240);
    }
  });
})();
