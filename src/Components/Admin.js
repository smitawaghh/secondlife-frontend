import React, { useState } from "react";
import "./Admin.css";

// ── NAVBAR ──────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="slf-nav">
      <a href="/" className="slf-nav__brand">
        <div className="slf-nav__logo">
          <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 13H8v-1c0-2.67 5.33-4 8-4v5z" />
          </svg>
        </div>
        <span>SecondLife <strong>Foods</strong></span>
      </a>

      <div className={`slf-nav__links ${menuOpen ? "slf-nav__links--open" : ""}`}>
        <a href="/home" className="slf-nav__link">Home</a>
        <a href="/donor-dashboard" className="slf-nav__link">Donor Dashboard</a>
        <a href="/create-lot" className="slf-nav__link">Create Lot</a>
        <a href="/qr-scanner" className="slf-nav__link">QR Scanner</a>
        <a href="/admin" className="slf-nav__link slf-nav__link--active">Admin Panel</a>
        <a href="/testing" className="slf-nav__link">Testing Screen</a>
      </div>

      <div className="slf-nav__actions">
        <a href="/login" className="slf-nav__btn slf-nav__btn--outline">Login</a>
        <a href="/signup" className="slf-nav__btn slf-nav__btn--fill">Sign Up</a>
      </div>

      <button className="slf-nav__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  );
};

// ── FOOTER ──────────────────────────────────────────────────
const Footer = () => (
  <footer className="slf-footer">
    <div className="slf-footer__inner">
      <div className="slf-footer__brand">
        <div className="slf-footer__logo-row">
          <div className="slf-footer__logo">
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 13H8v-1c0-2.67 5.33-4 8-4v5z" />
            </svg>
          </div>
          <span className="slf-footer__name">SecondLife <strong>Foods</strong></span>
        </div>
        <p className="slf-footer__tagline">
          Transforming expired, packaged goods into valuable resources to reduce food waste and nourish animals.
        </p>
        <div className="slf-footer__socials">
          <a href="#" className="slf-footer__social" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
          </a>
          <a href="#" className="slf-footer__social" aria-label="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
          </a>
          <a href="#" className="slf-footer__social" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
        </div>
      </div>

      <div className="slf-footer__col">
        <h4 className="slf-footer__heading">CONTACT</h4>
        <ul className="slf-footer__list">
          <li className="slf-footer__contact-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
            contact@secondlifefoods.org
          </li>
          <li className="slf-footer__contact-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.13 1 .37 2 .72 2.93a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.56 6.56l1.27-1.27a2 2 0 012.11-.45c.93.35 1.93.59 2.93.72A2 2 0 0122 16.92z"/></svg>
            +1 (123) 456-7890
          </li>
          <li className="slf-footer__contact-row slf-footer__contact-row--top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>123 Green St.<br />Cityname, ST 12345</span>
          </li>
        </ul>
      </div>

      <div className="slf-footer__col">
        <h4 className="slf-footer__heading">QUICK LINKS</h4>
        <ul className="slf-footer__list">
          <li><a href="/home">Home</a></li>
          <li><a href="/donate">Donate Food Lot</a></li>
          <li><a href="/create-lot">Create Lot</a></li>
          <li><a href="/track-lot">Track Lot</a></li>
        </ul>
      </div>

      <div className="slf-footer__col">
        <h4 className="slf-footer__heading">RESOURCES</h4>
        <ul className="slf-footer__list">
          <li><a href="/knowledge">Knowledge Pocket</a></li>
          <li><a href="/qr-scanner">QR Scanner</a></li>
          <li><a href="/admin">Admin Panel</a></li>
          <li><a href="/testing">Testing Screen</a></li>
        </ul>
      </div>

      <div className="slf-footer__col">
        <h4 className="slf-footer__heading">NEWSLETTER</h4>
        <p className="slf-footer__newsletter-text">Subscribe to our newsletter</p>
        <div className="slf-footer__newsletter">
          <input type="email" placeholder="Enter your email" className="slf-footer__input" />
          <button className="slf-footer__subscribe">Subscribe</button>
        </div>
      </div>
    </div>

    <div className="slf-footer__bottom">
      <span>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</span>
      <div className="slf-footer__legal">
        <a href="/privacy">Privacy Policy</a>
        <span>|</span>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </footer>
);

// ── SPARKLINE ────────────────────────────────────────────────
const Sparkline = ({ up = true, light = false }) => {
  const color = light ? "rgba(255,255,255,0.7)" : "#52b788";
  const d = up
    ? "M0,20 C15,16 30,11 45,9 C60,7 75,5 90,2"
    : "M0,3 C15,5 30,11 45,13 C60,15 75,16 90,19";
  return (
    <svg viewBox="0 0 90 22" width="72" height="24" fill="none">
      <path d={d} stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

// ── DATA ─────────────────────────────────────────────────────
const donations = [
  { id: "#SLF1021", donor: "Ravi Kumar",   type: "Cooked Meals",  qty: "30 kg",  ngo: "Bark Park Sanctuary", date: "Mar 25", status: "delivered"  },
  { id: "#SLF1022", donor: "Anita Sharma", type: "Groceries",     qty: "15 kg",  ngo: "Tails & Whiskers",    date: "Mar 24", status: "pending"    },
  { id: "#SLF1023", donor: "Priya Mehta",  type: "Packaged Food", qty: "50 pcs", ngo: "Furry Friends Haven", date: "Mar 22", status: "screening"  },
  { id: "#SLF1024", donor: "Arjun Das",    type: "Baked Goods",   qty: "20 kg",  ngo: "Sheltered Paws",      date: "Mar 21", status: "delivered"  },
  { id: "#SLF1025", donor: "Meena Roy",    type: "Dairy",         qty: "10 L",   ngo: "Bark Park Sanctuary", date: "Mar 20", status: "processing" },
  { id: "#SLF1026", donor: "Suresh Nair",  type: "Canned Goods",  qty: "40 pcs", ngo: "Happy Paws NGO",      date: "Mar 19", status: "delivered"  },
];

const ngos = [
  { name: "Bark Park Sanctuary", city: "Bangalore", lots: 34, animals: 620, status: "verified"  },
  { name: "Tails & Whiskers",    city: "Mumbai",    lots: 28, animals: 480, status: "verified"  },
  { name: "Furry Friends Haven", city: "Delhi",     lots: 19, animals: 310, status: "pending"   },
  { name: "Sheltered Paws",      city: "Chennai",   lots: 41, animals: 790, status: "verified"  },
  { name: "Happy Paws NGO",      city: "Pune",      lots: 12, animals: 200, status: "pending"   },
];

const statusMeta = {
  delivered:  { label: "Delivered",  cls: "adm-badge--delivered"  },
  pending:    { label: "Pending",    cls: "adm-badge--pending"    },
  screening:  { label: "Screening",  cls: "adm-badge--screening"  },
  processing: { label: "Processing", cls: "adm-badge--processing" },
  verified:   { label: "Verified",   cls: "adm-badge--delivered"  },
};

// ── ADMIN ────────────────────────────────────────────────────
const Admin = () => {
  const [activeTab, setActiveTab] = useState("donations");

  return (
    <>
      <Navbar />

      {/* ── HERO BANNER ── */}
      <div className="adm-hero">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80&auto=format&fit=crop"
          alt="nature background"
          className="adm-hero__bg"
        />
        <div className="adm-hero__overlay" />
        <div className="adm-hero__content">
          <div className="adm-hero__eyebrow">
            <span className="adm-hero__dot" />
            SecondLife Foods · Admin Panel
          </div>
          <h1 className="adm-hero__title">
            Manage &amp; <em>Monitor</em>
          </h1>
          <p className="adm-hero__sub">
            A real-time command centre for food donations, NGO partners, and platform activity.
          </p>
          <div className="adm-hero__pills">
            <span className="adm-hero__pill">📦 1,240 Donations</span>
            <span className="adm-hero__pill">🏢 32 Active NGOs</span>
            <span className="adm-hero__pill">🍽️ 18,450 Meals</span>
          </div>
        </div>

        <div className="adm-hero__ticker-wrap">
          <div className="adm-hero__ticker">
            {["🐾 4,200 dogs fed this month","🐱 1,800 cats helped","🐦 620 birds nourished","🌿 38 tonnes diverted","💛 112 active donors","🏠 6 partner shelters","🐾 4,200 dogs fed this month","🐱 1,800 cats helped","🌿 38 tonnes diverted"].map((t,i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-page">

        {/* ── STAT CARDS ── */}
        <div className="adm-stats">
          <div className="adm-stat adm-stat--dark">
            <div className="adm-stat__top"><span className="adm-stat__icon">📦</span><Sparkline up light /></div>
            <div className="adm-stat__value">1,240</div>
            <div className="adm-stat__label">Total Donations</div>
            <div className="adm-stat__delta adm-stat__delta--light">↑ +84 this month</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__top"><span className="adm-stat__icon">🏢</span><Sparkline up /></div>
            <div className="adm-stat__value">32</div>
            <div className="adm-stat__label">Active NGOs</div>
            <div className="adm-stat__delta adm-stat__delta--up">↑ +3 this month</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__top"><span className="adm-stat__icon">🍽️</span><Sparkline up /></div>
            <div className="adm-stat__value">18,450</div>
            <div className="adm-stat__label">Meals Served</div>
            <div className="adm-stat__delta adm-stat__delta--up">↑ +950 this month</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat__top"><span className="adm-stat__icon">🌿</span><Sparkline /></div>
            <div className="adm-stat__value">4.2 T</div>
            <div className="adm-stat__label">CO₂ Diverted</div>
            <div className="adm-stat__delta adm-stat__delta--down">↓ −0.3 T vs last month</div>
          </div>
        </div>

        {/* ── IMPACT MOSAIC ── */}
        <div className="adm-impact">
          <div className="adm-impact__imgs">
            <div className="adm-impact__img-wrap adm-impact__img-wrap--tall">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&auto=format&fit=crop" alt="Dogs at shelter" />
            </div>
            <div className="adm-impact__img-right">
              <div className="adm-impact__img-wrap">
                <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80&auto=format&fit=crop" alt="Cat" />
              </div>
              <div className="adm-impact__img-wrap">
                <img src="https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&q=80&auto=format&fit=crop" alt="Shelter" />
              </div>
            </div>
          </div>
          <div className="adm-impact__text">
            <div className="adm-impact__eyebrow">Our Impact</div>
            <h2 className="adm-impact__title">Every lot <em>transforms</em><br />a life</h2>
            <p className="adm-impact__body">
              From expired packets to nourishing meals — your admin actions directly
              impact thousands of animals across partner shelters every single month.
            </p>
            <div className="adm-impact__pills">
              <span>🐕 Dogs</span>
              <span>🐈 Cats</span>
              <span>🐦 Birds</span>
              <span>🐇 Rabbits</span>
            </div>
            <a href="/donate" className="adm-impact__cta">See Who You're Helping →</a>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="adm-grid">

          <div className="adm-main">
            <div className="adm-tabs">
              <button className={`adm-tab ${activeTab === "donations" ? "adm-tab--active" : ""}`} onClick={() => setActiveTab("donations")}>
                Recent Donations
              </button>
              <button className={`adm-tab ${activeTab === "ngos" ? "adm-tab--active" : ""}`} onClick={() => setActiveTab("ngos")}>
                NGO Partners
              </button>
            </div>

            {activeTab === "donations" && (
              <div className="adm-card adm-card--table">
                <div className="adm-card__header">
                  <div>
                    <h3 className="adm-card__title">All Donations</h3>
                    <p className="adm-card__sub">Latest food lot submissions across all partners</p>
                  </div>
                  <a href="/create-lot" className="adm-card__action">+ New Lot</a>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead><tr><th>Lot ID</th><th>Donor</th><th>Food Type</th><th>Quantity</th><th>NGO</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d.id}>
                          <td className="adm-td--id">{d.id}</td>
                          <td>{d.donor}</td><td>{d.type}</td><td>{d.qty}</td><td>{d.ngo}</td>
                          <td className="adm-td--date">{d.date}</td>
                          <td><span className={`adm-badge ${statusMeta[d.status].cls}`}>{statusMeta[d.status].label}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="adm-card__footer"><a href="/donations" className="adm-viewall">View all donations →</a></div>
              </div>
            )}

            {activeTab === "ngos" && (
              <div className="adm-card adm-card--table">
                <div className="adm-card__header">
                  <div>
                    <h3 className="adm-card__title">NGO Partners</h3>
                    <p className="adm-card__sub">Registered shelters and rescue organisations</p>
                  </div>
                  <a href="/add-ngo" className="adm-card__action">+ Add NGO</a>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead><tr><th>Organisation</th><th>City</th><th>Lots Received</th><th>Animals Fed</th><th>Status</th></tr></thead>
                    <tbody>
                      {ngos.map((n) => (
                        <tr key={n.name}>
                          <td>{n.name}</td><td>{n.city}</td><td>{n.lots}</td><td>{n.animals}</td>
                          <td><span className={`adm-badge ${statusMeta[n.status].cls}`}>{statusMeta[n.status].label}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <aside className="adm-sidebar">

            {/* ── Quick Actions ── */}
            <div className="adm-card">
              <h3 className="adm-card__title" style={{marginBottom:"16px"}}>Quick Actions</h3>
              <div className="adm-actions-grid">

                <a href="/create-lot" className="adm-action">
                  <div className="adm-action__icon-wrap adm-action__icon-wrap--green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      <polyline points="12 22 12 12"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    </svg>
                  </div>
                  <span className="adm-action__label">Create Lot</span>
                </a>

                <a href="/qr-scanner" className="adm-action">
                  <div className="adm-action__icon-wrap adm-action__icon-wrap--teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <path d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3z"/>
                    </svg>
                  </div>
                  <span className="adm-action__label">Scan QR</span>
                </a>

                <a href="/add-ngo" className="adm-action">
                  <div className="adm-action__icon-wrap adm-action__icon-wrap--sage">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <span className="adm-action__label">Add NGO</span>
                </a>

                <a href="/reports" className="adm-action">
                  <div className="adm-action__icon-wrap adm-action__icon-wrap--dark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6"  y1="20" x2="6"  y2="14"/>
                    </svg>
                  </div>
                  <span className="adm-action__label">Reports</span>
                </a>

              </div>
            </div>

            {/* ── Activity Feed ── */}
            <div className="adm-card">
              <div className="adm-feed__header">
                <h3 className="adm-card__title">Activity Feed</h3>
                <a href="/activity" className="adm-viewall">View all</a>
              </div>
              <ul className="adm-feed">
                {[
                  { dot: "green",  text: <><strong>#SLF1021</strong> delivered to Bark Park Sanctuary</>, time: "2 hours ago" },
                  { dot: "yellow", text: <>Screening in progress for <strong>#SLF1023</strong></>,        time: "5 hours ago" },
                  { dot: "green",  text: <>New NGO <strong>Furry Friends Haven</strong> registered</>,     time: "Yesterday"   },
                  { dot: "blue",   text: <><strong>#SLF1025</strong> is being processed</>,                time: "2 days ago"  },
                ].map((f, i) => (
                  <li key={i} className="adm-feed__item">
                    <span className={`adm-feed__dot adm-feed__dot--${f.dot}`} />
                    <div className="adm-feed__content">
                      <p className="adm-feed__text">{f.text}</p>
                      <span className="adm-feed__time">{f.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Status Breakdown ── */}
            <div className="adm-card">
              <h3 className="adm-card__title" style={{marginBottom:"18px"}}>Status Breakdown</h3>
              <div className="adm-breakdown">
                {[
                  { label: "Delivered",  pct: 54, cls: "adm-bar--green",  count: "669" },
                  { label: "Processing", pct: 21, cls: "adm-bar--blue",   count: "260" },
                  { label: "Screening",  pct: 15, cls: "adm-bar--yellow", count: "186" },
                  { label: "Pending",    pct: 10, cls: "adm-bar--gray",   count: "124" },
                ].map((s) => (
                  <div key={s.label} className="adm-breakdown__row">
                    <div className="adm-breakdown__meta">
                      <div className="adm-breakdown__left">
                        <span className={`adm-breakdown__dot adm-breakdown__dot--${s.cls.replace("adm-bar--","")}`} />
                        <span className="adm-breakdown__label">{s.label}</span>
                      </div>
                      <div className="adm-breakdown__right">
                        <span className="adm-breakdown__count">{s.count}</span>
                        <span className="adm-breakdown__pct">{s.pct}%</span>
                      </div>
                    </div>
                    <div className="adm-bar-track">
                      <div className={`adm-bar ${s.cls}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Donate a Lot card ── */}
            <div className="adm-card adm-card--photo">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80&auto=format&fit=crop"
                alt="Shelter animals"
                className="adm-photo__img"
              />
              <div className="adm-photo__body">
                <p className="adm-photo__quote">"Every donation you process gives an animal a second chance."</p>
                <a href="/create-lot" className="adm-photo__cta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  </svg>
                  Donate a Lot
                </a>
              </div>
            </div>

          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Admin;