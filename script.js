/* ══════════════════════════════════════════
   🌹 FALLING ROSES  — Canvas created by JS
   ══════════════════════════════════════════ */
const canvas = document.createElement("canvas");
canvas.id = "rosesCanvas";
canvas.style.cssText = [
  "position:fixed",
  "top:0", "left:0",
  "width:100%", "height:100%",
  "pointer-events:none",
  "z-index:9999",
].join(";");
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// الرموز اللي هتتساقط
const ROSES = ["🌹", "🌸", "🌺", "✿", "❀", "🌷"];

function spawnPetal() {
  return {
    x: Math.random() * canvas.width,
    y: -30,
    char: ROSES[Math.floor(Math.random() * ROSES.length)],
    size: Math.random() * 20 + 12,        // 12–32px
    speedY: Math.random() * 1.4 + 0.5,      // سرعة النزول
    speedX: (Math.random() - 0.5) * 0.7,    // انجراف يسار/يمين
    angle: Math.random() * 360,
    spin: (Math.random() - 0.5) * 1.8,    // دوران
    alpha: Math.random() * 0.5 + 0.35,     // شفافية 0.35–0.85
    wave: Math.random() * Math.PI * 2,    // موجة عشوائية
  };
}

function animateRoses() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // إنتاج وردة جديدة كل فريم بنسبة معينة
  if (Math.random() < 0.18) petals.push(spawnPetal());

  petals.forEach(p => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.wave) * 0.5;
    p.wave += 0.03;
    p.angle += p.spin;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = `${p.size}px serif`;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle * Math.PI / 180);
    ctx.fillText(p.char, 0, 0);
    ctx.restore();
  });

  // احذف اللي طلع تحت الشاشة
  petals = petals.filter(p => p.y < canvas.height + 50);

  requestAnimationFrame(animateRoses);
}

animateRoses();   // ابدأ فوراً

/* ══════════════════════════════════════════
   الكود الأصلي
   ══════════════════════════════════════════ */
const opening = document.getElementById("opening");
const site = document.getElementById("site");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

/* ── فتح الدعوة ── */
openBtn.addEventListener("click", async () => {
  opening.classList.add("hidden");
  site.classList.remove("hidden");
  musicBtn.classList.remove("hidden");
  try { await music.play(); musicBtn.textContent = "❚❚"; } catch (e) { }
  window.scrollTo(0, 0);
  startReveal();   // ابدأ الـ scroll reveal بعد الفتح
});

/* ── موسيقى ── */
musicBtn.addEventListener("click", () => {
  if (music.paused) { music.play(); musicBtn.textContent = "❚❚"; }
  else { music.pause(); musicBtn.textContent = "♫"; }
});

/* ── العداد التنازلي ── */
const target = new Date("2026-10-15T20:00:00");
const prevVals = {};

function updateCountdown() {
  let diff = target - new Date();
  if (diff < 0) diff = 0;
  const s = Math.floor(diff / 1000);
  const vals = {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
  Object.entries(vals).forEach(([k, v]) => {
    const str = String(v).padStart(2, "0");
    const el = document.getElementById(k);
    if (!el) return;
    if (str !== prevVals[k]) {
      el.textContent = str;
      el.classList.remove("tick");
      void el.offsetWidth;          // reflow
      el.classList.add("tick");
      prevVals[k] = str;
    }
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── تقويم أكتوبر 2026 ── */
(function buildCalendar() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;
  // Oct 1, 2026 = Thursday → Monday-based offset = (4+6)%7 = 3
  const firstDay = new Date(2026, 9, 1).getDay();
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) {
    const b = document.createElement("button");
    b.className = "empty";
    grid.appendChild(b);
  }
  for (let d = 1; d <= 31; d++) {
    const b = document.createElement("button");
    b.textContent = d;
    if (d === 15) b.classList.add("wedding");
    grid.appendChild(b);
  }
})();

/* ── Scroll Reveal ── */
function startReveal() {
  // أضف الكلاس على كل عناصر main بشكل ديناميكي واحد واحد
  const targets = site.querySelectorAll(
    ".section-kicker, h2, .muted, .countdown, .gallery, .photo-note, " +
    ".info-frame, .calendar, .large-ornament, .message, h3, .ornament, footer"
  );

  targets.forEach(el => {
    if (!el.classList.contains("will-reveal")) {
      el.classList.add("will-reveal");
    }
  });

  // Fallback: اظهرهم كلهم بعد 400ms
  const timer = setTimeout(() => {
    targets.forEach(el => el.classList.add("shown"));
  }, 400);

  // IntersectionObserver للأنيميشن عند التمرير
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shown");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => io.observe(el));

    // بعد ثانية امسح الـ fallback لأن الـ observer اشتغل
    setTimeout(() => clearTimeout(timer), 1000);
  }
}

/* ── Lightbox ── */
const lightbox = document.getElementById("lightbox");
const lbContent = document.getElementById("lightboxContent");

document.querySelectorAll(".photo").forEach(photo => {
  photo.addEventListener("click", () => {
    const img = photo.querySelector("img");
    lbContent.innerHTML = "";          // امسح المحتوى القديم
    if (img) {
      // عرض الصورة الحقيقية
      const clone = img.cloneNode(true);
      clone.style.cssText = "width:100%;height:100%;object-fit:contain;border-radius:6px;display:block;";
      lbContent.style.background = "transparent";
      lbContent.appendChild(clone);
    } else {
      // fallback للـ placeholder
      lbContent.textContent = photo.innerText;
      lbContent.style.background = getComputedStyle(photo).background;
    }
    lightbox.classList.remove("hidden");
  });
});
document.getElementById("closeLightbox")
  .addEventListener("click", () => lightbox.classList.add("hidden"));
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});
