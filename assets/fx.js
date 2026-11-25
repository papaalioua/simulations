(() => {
  // matrix rain background
  const cv = document.getElementById("matrix");
  if (cv && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = cv.getContext("2d"), chars = "01アイウエオカキクケコ#$%&<>/\\{}[]=+*";
    let cols, drops, fs = 15;
    const size = () => { cv.width = innerWidth; cv.height = innerHeight; cols = Math.ceil(cv.width / fs); drops = Array.from({ length: cols }, () => Math.random() * -50); };
    size(); addEventListener("resize", size);
    setInterval(() => {
      ctx.fillStyle = "rgba(4,7,10,.12)"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = fs + "px JetBrains Mono, monospace";
      for (let i = 0; i < cols; i++) {
        ctx.fillStyle = Math.random() > .975 ? "#eafff5" : "#39ff88";
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fs, drops[i] * fs);
        if (drops[i] * fs > cv.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      }
    }, 55);
  }

  // boot sequence (home page)
  const boot = document.getElementById("boot");
  if (boot) {
    const n = document.querySelectorAll(".card").length;
    const lines = [
      ['<span class="g">root@papaalioua</span>:<span class="c">~</span>$ ssh lab.gns3 --secure', 18],
      ['[<span class="ok"> OK </span>] tunnel established · AES-256 · SHA-256', 8],
      ['[<span class="ok"> OK </span>] mounting /simulations ... ' + n + ' labs found', 8],
      ['[<span class="w">WARN</span>] curiosity level: critical', 8],
      ['<span class="g">root@papaalioua</span>:<span class="c">~/simulations</span>$ ls -la <span class="cur"></span>', 18],
    ];
    if (sessionStorage.getItem("booted")) {
      boot.innerHTML = lines.map(l => l[0]).join("\n");
    } else {
      sessionStorage.setItem("booted", 1);
      let li = 0, out = "";
      const typeLine = () => {
        if (li >= lines.length) return;
        const [h, speed] = lines[li], plain = h.replace(/<[^>]+>/g, "");
        let ci = 0;
        const step = () => {
          ci++;
          boot.innerHTML = out + plain.slice(0, ci).replace(/</g, "&lt;");
          if (ci < plain.length) setTimeout(step, speed);
          else { out += h + "\n"; boot.innerHTML = out; li++; setTimeout(typeLine, 180); }
        };
        step();
      };
      typeLine();
    }
  }

  // filter + search
  const q = document.getElementById("q"), cards = [...document.querySelectorAll(".card")], empty = document.getElementById("empty");
  let cat = "*";
  const apply = () => {
    const s = (q?.value || "").toLowerCase().trim(); let shown = 0;
    cards.forEach(c => {
      const ok = (cat === "*" || c.dataset.cat === cat) && (!s || c.dataset.q.includes(s));
      c.hidden = !ok; if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  q?.addEventListener("input", apply);
  document.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("on"));
    b.classList.add("on"); cat = b.dataset.f; apply();
  }));
  addEventListener("keydown", e => { if (e.key === "/" && q && document.activeElement !== q) { e.preventDefault(); q.focus(); } });
})();
