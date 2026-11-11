import { useState, useEffect, type ComponentType } from "react";

/* EcoPulse – "Understand Climate. Take Action."
   Simple React site for SDG 13. No backend, login, database or statistics.
   Journey: Learn -> Choose -> Take Action -> Reflect and Share */

type PageId = "home" | "learn" | "actions" | "challenge" | "about";
type GoFn = (id: PageId) => void;
type Item = { t: string; d: string };

const NAV: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "learn", label: "Learn" },
  { id: "actions", label: "Actions" },
  { id: "challenge", label: "7-Day Challenge" },
  { id: "about", label: "About" },
];

const LEARN: Item[] = [
  { t: "What is climate change?", d: "Climate change is a long-term shift in temperatures and weather patterns. Since the 1800s, human activity has been its main driver." },
  { t: "What are greenhouse gases?", d: "Gases such as carbon dioxide and methane trap heat in the atmosphere. More of them means a warmer planet." },
  { t: "Where do rising emissions come from?", d: "Mainly from burning fossil fuels for energy, transport and industry, and from changes in how land is used." },
  { t: "What are the effects?", d: "Warmer temperatures, heavier rain and heat extremes, rising seas and pressure on food, water and health." },
  { t: "Why does action matter?", d: "Small choices repeated by many people add up, and informed young people can influence families, schools and communities." },
];

const ACTIONS: Item[] = [
  { t: "Walk or use public transport", d: "Fewer private car trips means fewer transport emissions." },
  { t: "Save electricity", d: "Switch off unused lights and devices; unplug chargers." },
  { t: "Reduce plastic waste", d: "Carry a bottle and a bag instead of single-use items." },
  { t: "Reuse and recycle", d: "Repair, reuse or pass on items before throwing them away." },
  { t: "Avoid unnecessary consumption", d: "Buy only what you need and choose things that last." },
];

const DAYS: string[] = [
  "Walk or use public transport",
  "Avoid single-use plastic",
  "Save electricity",
  "Reduce food waste",
  "Reuse an item",
  "Share a climate-awareness message",
  "Review your actions",
];

// Replace with the real EcoPulse Instagram link
const INSTAGRAM_URL = "https://www.instagram.com/";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function InstagramLink({ label = "Instagram" }: { label?: string }) {
  return (
    <a className="ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="EcoPulse on Instagram">
      <InstagramIcon />
      <span>{label}</span>
    </a>
  );
}

const CSS = `
:root{--forest:#1f5a3a;--deep:#123a26;--leaf:#8fd19e;--mist:#eaf5ec;--grey:#f3f4f2;--ink:#1d2a22;--line:#d5ddd6}
*{box-sizing:border-box;margin:0}
body{font-family:Georgia,"Times New Roman",serif;color:var(--ink);background:#fff;line-height:1.65}
.sans,button,nav,.chip{font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--deep);color:#fff}
.bar{max-width:1040px;margin:auto;padding:12px 20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.logo{font-size:1.3rem;font-weight:700;letter-spacing:.2px}
.logo span{color:var(--leaf)}
nav{display:flex;flex-wrap:wrap;gap:4px}
nav button{background:none;border:0;color:#dfeee3;padding:8px 12px;border-radius:6px;font-size:.95rem;cursor:pointer}
nav button:hover{background:rgba(255,255,255,.12)}
nav button[aria-current="page"]{background:var(--leaf);color:var(--deep);font-weight:600}
button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #f2c744;outline-offset:2px}
main{width:100%;max-width:1040px;margin:0 auto;padding:0 20px 56px;flex:1}
.app{min-height:100vh;display:flex;flex-direction:column}
.hero{background:linear-gradient(180deg,var(--mist),#fff);margin:0 -20px;padding:72px 20px 56px}
.hero h1{font-size:clamp(2.4rem,7vw,4.4rem);line-height:1.05;color:var(--deep);max-width:12ch}
.hero p{max-width:56ch;margin:18px 0 28px;font-size:1.15rem}
.btn{display:inline-block;background:var(--forest);color:#fff;border:0;padding:12px 22px;border-radius:8px;font-size:1rem;cursor:pointer;text-decoration:none}
.btn:hover{background:var(--deep)}
.btn.alt{background:#fff;color:var(--forest);border:2px solid var(--forest);margin-left:10px}
.btn.alt:hover{background:var(--mist)}
h2{font-size:clamp(1.7rem,4vw,2.4rem);color:var(--deep);margin:48px 0 8px}
.lead{max-width:60ch;margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{background:var(--grey);border-left:5px solid var(--forest);padding:18px 20px;border-radius:6px}
.card h3{font-size:1.1rem;color:var(--deep);margin-bottom:4px}
.journey{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
.chip{background:var(--mist);border:1px solid var(--line);padding:8px 14px;border-radius:99px;font-size:.95rem}
.chip b{color:var(--forest)}
.list{list-style:none;padding:0;max-width:640px}
.list li{display:flex;gap:12px;align-items:center;padding:14px 16px;border:1px solid var(--line);border-radius:8px;margin-bottom:10px;background:#fff;font-family:system-ui,sans-serif}
.list li.done{background:var(--mist);border-color:var(--forest)}
.list li.done .txt{text-decoration:line-through;color:#4b6355}
.list input{width:22px;height:22px;accent-color:var(--forest)}
.day{font-weight:700;color:var(--forest);min-width:52px}
.progress{height:12px;background:var(--grey);border-radius:99px;overflow:hidden;max-width:640px;margin:8px 0 20px}
.progress div{height:100%;background:var(--forest);transition:width .3s}
.reflect{background:var(--mist);padding:20px;border-radius:8px;max-width:640px;margin-top:20px}
.note{font-size:.9rem;color:#4b6355;margin-top:10px}
footer{background:var(--deep);color:#cfe3d4;text-align:center;padding:24px 20px;font-family:system-ui,sans-serif;font-size:.9rem}
footer a{color:var(--leaf)}
.ig{display:inline-flex;align-items:center;gap:8px;color:inherit;text-decoration:none}
.ig svg{width:22px;height:22px;flex:none}
.bar .ig{padding:6px 10px;border-radius:6px;color:#dfeee3;font-family:system-ui,sans-serif;font-size:.95rem}
.bar .ig:hover{background:rgba(255,255,255,.12)}
.nav-right{display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.menu-btn{display:none;background:none;border:2px solid rgba(255,255,255,.4);color:#fff;border-radius:8px;padding:6px 8px;cursor:pointer;align-items:center}
.menu-btn svg{width:26px;height:26px}
@media (max-width:700px){
.menu-btn{display:inline-flex}
nav{display:none;width:100%;flex-direction:column;gap:2px;padding-top:6px;border-top:1px solid rgba(255,255,255,.18)}
nav.open{display:flex}
nav button{text-align:left;padding:12px;font-size:1.05rem}
}
@media (max-width:560px){.btn.alt{margin:10px 0 0}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

function Home({ go }: { go: GoFn }) {
  return (
    <>
      <section className="hero">
        <h1>Understand Climate. Take Action.</h1>
        <p>
          EcoPulse helps young people understand rising emissions and discover
          small, practical actions that support climate action. Small actions.
          A better future.
        </p>
        <button className="btn" onClick={() => go("learn")}>Explore Climate Action</button>
        <button className="btn alt" onClick={() => go("challenge")}>Start the 7-Day Challenge</button>
      </section>

      <h2>Rising emissions, in short</h2>
      <p className="lead">
        Human activities, mainly greenhouse gas emissions, have caused global
        warming (IPCC, 2023). Learning how this works is the first step to
        doing something about it.
      </p>

      <h2>Your journey</h2>
      <div className="journey">
        <span className="chip"><b>1 Learn</b> about emissions</span>
        <span className="chip"><b>2 Choose</b> an action</span>
        <span className="chip"><b>3 Take action</b> in 7 days</span>
        <span className="chip"><b>4 Reflect and share</b></span>
      </div>
    </>
  );
}

function Learn({ go }: { go: GoFn }) {
  return (
    <>
      <h2>Learn about climate change</h2>
      <p className="lead">Short answers to the five questions to start with.</p>
      <div className="grid">
        {LEARN.map((c) => (
          <article className="card" key={c.t}>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
          </article>
        ))}
      </div>
      <p className="note">Sources: IPCC (2023); United Nations, Goal 13: Climate action.</p>
      <p style={{ marginTop: 24 }}>
        <button className="btn" onClick={() => go("actions")}>See climate-friendly actions</button>
      </p>
    </>
  );
}

function Actions({ go }: { go: GoFn }) {
  return (
    <>
      <h2>Climate-friendly actions</h2>
      <p className="lead">Pick one or two that fit your day.</p>
      <div className="grid">
        {ACTIONS.map((c) => (
          <article className="card" key={c.t}>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
          </article>
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <button className="btn" onClick={() => go("challenge")}>Try the 7-day challenge</button>
      </p>
    </>
  );
}

function Challenge() {
  const [done, setDone] = useState<boolean[]>(Array(DAYS.length).fill(false));
  const [msg, setMsg] = useState<string>("");
  const count = done.filter(Boolean).length;

  const toggle = (i: number) => setDone(done.map((v, j) => (j === i ? !v : v)));

  const share = async () => {
    const text = `I completed ${count} of 7 days of the EcoPulse climate challenge. Understand Climate. Take Action.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "EcoPulse", text, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setMsg("Copied. Paste it anywhere to share.");
    } catch {
      setMsg("Sharing was cancelled or is not available in this browser.");
    }
  };

  return (
    <>
      <h2>Seven-day climate challenge</h2>
      <p className="lead">Tick each day when you finish it. Your ticks reset when you reload the page.</p>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={7} aria-valuenow={count} aria-label="Challenge progress">
        <div style={{ width: `${(count / 7) * 100}%` }} />
      </div>
      <ul className="list">
        {DAYS.map((d, i) => (
          <li key={d} className={done[i] ? "done" : ""}>
            <input id={`d${i}`} type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
            <label htmlFor={`d${i}`} style={{ display: "flex", gap: 12, flex: 1, cursor: "pointer" }}>
              <span className="day">Day {i + 1}</span>
              <span className="txt">{d}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="reflect">
        <h3>Reflect and share</h3>
        <p>
          {count === 0 && "Complete a day to start your progress."}
          {count > 0 && count < 7 && `${count} of 7 days done. Keep going.`}
          {count === 7 && "All 7 days done. Which action was easiest to keep? Tell a friend."}
        </p>
        <p style={{ marginTop: 12 }}>
          <button className="btn" onClick={share}>Share my progress</button>
        </p>
        {msg && <p className="note" role="status">{msg}</p>}
      </div>
    </>
  );
}

function About() {
  return (
    <>
      <h2>About EcoPulse</h2>
      <p className="lead">
        EcoPulse is a student project that raises climate awareness among young
        people aged 16 to 30 through this website, an Instagram campaign and a
        webinar.
      </p>
      <div className="grid">
        <article className="card"><h3>SDG 13: Climate Action</h3><p>Target 13.3 calls for better education and awareness on climate change. EcoPulse responds to that target.</p></article>
        <article className="card"><h3>Objectives</h3><p>Explain rising emissions, show practical actions and encourage young people to take part.</p></article>
        <article className="card"><h3>Target audience</h3><p>Young people aged 16 to 30.</p></article>
        <article className="card"><h3>Follow us</h3><p><InstagramLink label="EcoPulse on Instagram" /></p></article>
      </div>
      <p className="note">This project raises awareness. It does not measure reductions in emissions.</p>
    </>
  );
}

export default function App() {
  // Page is kept in the URL hash: /#learn, /#actions, /#challenge, /#about
  const fromHash = (): PageId => {
    const id = window.location.hash.replace("#", "");
    return NAV.some((n) => n.id === id) ? (id as PageId) : "home";
  };
  const [page, setPage] = useState<PageId>(fromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onChange = () => { setPage(fromHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  useEffect(() => {
    const names: Record<PageId, string> = { home: "Home", learn: "Learn", actions: "Actions", challenge: "7-Day Challenge", about: "About" };
    document.title = `${names[page]} | EcoPulse`;
  }, [page]);

  const go: GoFn = (id) => {
    setMenuOpen(false);
    window.location.hash = id === "home" ? "" : id; if (id === "home") setPage("home"); };

  const views: Record<PageId, ComponentType<{ go: GoFn }>> = { home: Home, learn: Learn, actions: Actions, challenge: Challenge, about: About };
  const View = views[page];

  return (
    <div className="app">
      <style>{CSS}</style>
      <header>
        <div className="bar">
          <div className="logo">Eco<span>Pulse</span></div>
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l14 14M19 5L5 19" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <nav id="main-nav" className={menuOpen ? "open" : ""} aria-label="Main">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => go(n.id)} aria-current={page === n.id ? "page" : undefined}>
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main><View go={go} /></main>
      <footer>
        <p>EcoPulse · SDG 13: Climate Action · Understand Climate. Take Action.</p>
        <p style={{ marginTop: 8 }}><InstagramLink label="Follow EcoPulse on Instagram" /></p>
      </footer>
    </div>
  );
}
