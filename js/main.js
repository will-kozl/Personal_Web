const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const header = document.querySelector(".nav");
const progress = document.querySelector("#scroll-progress");
const cursor = document.querySelector(".cursor");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const heroCopy = document.querySelector(".hero-copy");
const sheet = document.querySelector(".sheet");

const onScroll = () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${amount})`;
  }
  if (!reduceMotion && window.scrollY < window.innerHeight * 1.2) {
    const y = window.scrollY;
    if (heroCopy) heroCopy.style.translate = `0 ${y * 0.08}px`;
    if (sheet) sheet.style.translate = `0 ${y * 0.03}px`;
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const links = [...document.querySelectorAll(".nav-links a")];
const railLinks = [...document.querySelectorAll(".rail a")];
const sections = [...new Set([...links, ...railLinks].map((link) => document.querySelector(link.getAttribute("href"))))].filter(Boolean);

const markCurrent = (id) => {
  [...links, ...railLinks].forEach((link) => {
    if (link.getAttribute("href") === id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

if (sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markCurrent(`#${entry.target.id}`);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach((section) => spy.observe(section));
}

const cards = document.querySelectorAll(
  ".project, .job, .schools li, .skill-grid article, .contact-link, .sheet, .leadership"
);

cards.forEach((card) => {
  card.classList.add("glow");
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

if (!reduceMotion) {
  document.documentElement.classList.add("js");
  const revealables = document.querySelectorAll(
    ".band li, .section-head, .project, .job, .schools li, .skill-grid article, .leadership, .contact-link"
  );
  revealables.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--d", `${(index % 3) * 90}ms`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );
  revealables.forEach((item) => io.observe(item));
}

const finePointer = window.matchMedia("(pointer: fine)").matches;
if (cursor && finePointer && !reduceMotion) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    cursor.classList.add("is-on");
    const target = event.target;
    const hot = target instanceof Element && target.closest("a, button, .project, .job, .skill-grid article, .contact-link");
    document.body.classList.toggle("cursor-hot", Boolean(hot));
  });

  window.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-on");
  });

  const dot = document.querySelector(".cursor-dot");
  let dx = x;
  let dy = y;

  const follow = () => {
    cx += (x - cx) * 0.16;
    cy += (y - cy) * 0.16;
    dx += (x - dx) * 0.38;
    dy += (y - dy) * 0.38;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    if (dot) {
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
      dot.classList.toggle("is-on", cursor.classList.contains("is-on"));
    }
    requestAnimationFrame(follow);
  };
  follow();
}

if (!reduceMotion) {
  const heading = document.querySelector("h1");
  if (heading) {
    const first = "Volodymyr";
    const last = "Kozlovskyi";
    heading.classList.add("is-split");
    heading.setAttribute("aria-label", `${first} ${last}`);
    heading.replaceChildren();

    const line = document.createElement("span");
    line.className = "line";
    line.setAttribute("aria-hidden", "true");
    [...first].forEach((character, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character;
      span.style.setProperty("--i", String(index));
      line.append(span);
    });

    const emphasis = document.createElement("em");
    emphasis.setAttribute("aria-hidden", "true");
    [...last].forEach((character, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = character;
      span.style.setProperty("--i", String(index + first.length));
      emphasis.append(span);
    });

    heading.append(line, emphasis);
  }
}

const clock = document.querySelector("#clock");
if (clock) {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  const tick = () => {
    clock.textContent = format.format(new Date());
  };
  tick();
  window.setInterval(tick, 1000);
}

if (finePointer && !reduceMotion) {
  document.querySelectorAll(".project, .sheet").forEach((card) => {
    card.classList.add("tilt");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      button.style.translate = `${(x * 0.28).toFixed(1)}px ${(y * 0.4).toFixed(1)}px`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.translate = "";
    });
  });
}

const field = document.querySelector(".field");
if (field instanceof HTMLCanvasElement && !reduceMotion) {
  const context = field.getContext("2d");
  const parent = field.parentElement;
  if (context && parent) {
    const points = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00032,
      vy: (Math.random() - 0.5) * 0.00032,
    }));
    let width = 0;
    let height = 0;
    let mouseX = 0.72;
    let mouseY = 0.28;
    let running = true;

    const fit = () => {
      const rect = parent.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      field.width = Math.max(1, Math.floor(width * ratio));
      field.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    fit();
    window.addEventListener("resize", fit);
    parent.addEventListener("pointermove", (event) => {
      const rect = parent.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / rect.width;
      mouseY = (event.clientY - rect.top) / rect.height;
    });

    const watcher = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
    });
    watcher.observe(parent);

    const paint = () => {
      requestAnimationFrame(paint);
      if (!running || document.hidden || width < 2) return;
      context.clearRect(0, 0, width, height);
      points.forEach((point) => {
        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const distance = Math.hypot(dx, dy);
        if (distance < 0.2) {
          point.x += dx * 0.012;
          point.y += dy * 0.012;
        }
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > 1) point.vx *= -1;
        if (point.y < 0 || point.y > 1) point.vy *= -1;
      });

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const distance = Math.hypot(dx, dy);
          if (distance > 128) continue;
          context.strokeStyle = `rgba(125, 211, 252, ${(0.2 * (1 - distance / 128)).toFixed(3)})`;
          context.beginPath();
          context.moveTo(a.x * width, a.y * height);
          context.lineTo(b.x * width, b.y * height);
          context.stroke();
        }
      }

      points.forEach((point) => {
        context.fillStyle = "rgba(219, 234, 254, 0.9)";
        context.beginPath();
        context.arc(point.x * width, point.y * height, 1.5, 0, Math.PI * 2);
        context.fill();
      });
    };

    paint();
  }
}
