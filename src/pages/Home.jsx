import { useState } from "react";
import { Link } from "react-router-dom";

const TICKER = [
  "4,200 kg of pet food diverted this month",
  "1,800 cats helped across 6 shelters",
  "620 birds nourished at rescue centres",
  "38 tonnes diverted from landfill this year",
  "112 active donors on the platform",
  "6 verified partner shelters receiving lots",
  "100% QR-verified custody chain",
  "Zero food waste, maximum animal impact",
];

const HOW = [
  {
    step: "01",
    icon: "🥡",
    title: "Log Surplus Food",
    desc: "Register expired or near-expiry packets through the donor portal. Our 3-step wizard takes under 2 minutes.",
  },
  {
    step: "02",
    icon: "📷",
    title: "Get a QR Code",
    desc: "Each lot gets a cryptographically-signed QR for real-time custody tracking from donor to shelter — fully auditable.",
  },
  {
    step: "03",
    icon: "🐾",
    title: "Animals Get Fed",
    desc: "Verified delivery to partner shelters. You see exactly which animals benefited from every single donation.",
  },
];

const PARTNERS = ["FoodCo India", "PetShelter NGO", "GreenMart", "SaveFoods Inc.", "ResQ Shelter", "VetCare Plus"];

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.12 2.96 20.26 2.07 21 1 21h22c-3-3-5.5-7-7-13z" />
  </svg>
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="home-page">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="home-nav__burger"
            onClick={() => setMenuOpen((x) => !x)}
            aria-label="Open menu"
            type="button"
          >
            <span /><span /><span />
          </button>
          <Link to="/home" className="home-nav__brand">
            <div className="home-nav__logo">{LOGO_SVG}</div>
            <div className="home-nav__name">
              SecondLife <strong>Foods</strong>
            </div>
          </Link>
        </div>

        <div className="home-nav__links">
          <a href="#how" className="home-nav__link">How it works</a>
          <a href="#impact" className="home-nav__link">Our Impact</a>
          <a href="#how" className="home-nav__link">For Donors</a>
          <a href="#impact" className="home-nav__link">Partners</a>
        </div>

        <div className="home-nav__actions">
          <Link to="/login" className="home-nav__signin">Sign In</Link>
          <Link to="/login" className="home-nav__cta">Get Started</Link>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="home-mobile-overlay" onClick={closeMenu} />
      )}
      <div className={`home-mobile-menu${menuOpen ? " home-mobile-menu--open" : ""}`}>
        <div className="home-mobile-menu__head">
          <Link
            to="/home"
            onClick={closeMenu}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div style={{ width: 32, height: 32, background: "var(--gd)", borderRadius: 8, display: "grid", placeItems: "center" }}>
              {LOGO_SVG}
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>SecondLife Foods</span>
          </Link>
          <button className="home-mobile-menu__close" onClick={closeMenu} type="button">
            ✕
          </button>
        </div>
        <div className="home-mobile-menu__links">
          <a href="#how" className="home-mobile-menu__link" onClick={closeMenu}>How it works</a>
          <a href="#impact" className="home-mobile-menu__link" onClick={closeMenu}>Our Impact</a>
          <a href="#how" className="home-mobile-menu__link" onClick={closeMenu}>For Donors</a>
          <a href="#impact" className="home-mobile-menu__link" onClick={closeMenu}>Partners</a>
        </div>
        <div className="home-mobile-menu__foot">
          <Link to="/login" className="btn ghost" onClick={closeMenu}>Sign In</Link>
          <Link to="/login" className="btn primary" onClick={closeMenu}>Get Started →</Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__eyebrow">
            <span>SECONDLIFE FOODS</span>
            <span>·</span>
            <span>ANIMAL WELFARE INITIATIVE</span>
          </div>

          <h1 className="home-hero__title">
            Your surplus is<br />
            <em>their survival.</em>
          </h1>

          <p className="home-hero__desc">
            Every expired packet you donate becomes a meal for a stray dog, a shelter cat,
            or a rescued bird. Safe. Verified. Life-changing.
          </p>

          <div className="home-hero__btns">
            <Link to="/login" className="home-hero__btn home-hero__btn--primary">
              Start Donating →
            </Link>
            <a href="#how" className="home-hero__btn home-hero__btn--outline">
              See How It Works
            </a>
          </div>

          <div className="home-hero__stats">
            <div className="home-hero__stat">
              <div className="home-hero__stat-val">38T</div>
              <div className="home-hero__stat-lab">Food diverted monthly</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-val">6,620</div>
              <div className="home-hero__stat-lab">Animals fed this month</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-val">6</div>
              <div className="home-hero__stat-lab">Verified shelters</div>
            </div>
            <div className="home-hero__stat">
              <div className="home-hero__stat-val">112</div>
              <div className="home-hero__stat-lab">Active donors</div>
            </div>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="home-hero__ticker-wrap">
          <div className="home-hero__ticker">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i}>⬥ {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted by ── */}
      <section className="home-trusted">
        <p>Trusted by food businesses and shelters across the country</p>
        <div className="home-trusted__logos">
          {PARTNERS.map((p) => (
            <span key={p} className="home-trusted__logo">{p}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home-how" id="how">
        <div className="home-how__eyebrow">Simple process</div>
        <h2 className="home-how__title">
          Three steps to <em>real impact</em>
        </h2>
        <div className="home-how__grid">
          {HOW.map((item, i) => (
            <div key={i} className="home-how__step">
              <div className="home-how__num">{item.step}</div>
              <div className="home-how__step-icon">{item.icon}</div>
              <div className="home-how__step-title">{item.title}</div>
              <div className="home-how__step-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Impact ── */}
      <section className="home-impact" id="impact">
        <div className="home-impact__eyebrow">Real Change</div>
        <h2 className="home-impact__title">
          Every kilo counts<br />
          <em>for a life that matters</em>
        </h2>
        <p className="home-impact__desc">
          We work with verified animal shelters and rescue organisations across the country.
          Every donation is tracked end-to-end with signed QR codes, so you always know exactly where your food went.
        </p>
        <div className="home-impact__stats">
          <div>
            <div className="home-impact__stat-val">38T</div>
            <div className="home-impact__stat-lab">Tonnes diverted</div>
          </div>
          <div>
            <div className="home-impact__stat-val">6,620</div>
            <div className="home-impact__stat-lab">Animals fed monthly</div>
          </div>
          <div>
            <div className="home-impact__stat-val">112</div>
            <div className="home-impact__stat-lab">Active donors</div>
          </div>
          <div>
            <div className="home-impact__stat-val">100%</div>
            <div className="home-impact__stat-lab">QR-verified deliveries</div>
          </div>
        </div>
        <Link to="/login" className="home-impact__cta">
          Get started — it&apos;s free →
        </Link>
      </section>

      {/* ── Footer — multi-column ── */}
      <footer className="home-footer">
        <div className="home-footer__main">
          {/* Brand column */}
          <div className="home-footer__col-brand">
            <div className="home-footer__col-logo">
              <div className="home-footer__col-logomark">{LOGO_SVG}</div>
              <div className="home-footer__col-name">SecondLife Foods</div>
            </div>
            <p className="home-footer__col-desc">
              We divert surplus food to verified animal shelters, reducing waste
              and feeding those who cannot speak for themselves.
            </p>
            <div className="home-footer__social">
              <a href="#impact" className="home-footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#impact" className="home-footer__social-link" aria-label="LinkedIn">in</a>
              <a href="#impact" className="home-footer__social-link" aria-label="Instagram">ig</a>
            </div>
          </div>

          {/* Platform column */}
          <div className="home-footer__col">
            <div className="home-footer__col-head">Platform</div>
            <Link to="/login">Dashboard</Link>
            <Link to="/login">Create a Lot</Link>
            <Link to="/login">QR Tracking</Link>
            <Link to="/login">Reports</Link>
            <Link to="/login">Compliance</Link>
          </div>

          {/* Learn column */}
          <div className="home-footer__col">
            <div className="home-footer__col-head">Learn</div>
            <a href="#how">How it works</a>
            <a href="#impact">Our Mission</a>
            <a href="#how">Partner With Us</a>
            <a href="#how">Donor Guide</a>
            <a href="#impact">FAQs</a>
          </div>

          {/* Company column */}
          <div className="home-footer__col">
            <div className="home-footer__col-head">Company</div>
            <a href="#impact">About</a>
            <a href="#impact">Contact Us</a>
            <a href="#impact">Blog</a>
            <a href="#impact">Privacy Policy</a>
            <a href="#impact">Terms of Service</a>
          </div>
        </div>

        <div className="home-footer__bar">
          <span>© 2026 SecondLife Foods. All rights reserved.</span>
          <span>
            Reducing food waste ·{" "}
            <a href="#impact">Feeding animals in need</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
