import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

/* ─── SEED DATA ─── */
const lotsSeed = [
  { id: "LP-002", status: "Delivered",  qty: "50 packs",  destination: "Sheltered Paws",     updated: "Mar 25" },
  { id: "LP-001", status: "Delivered",  qty: "30 packs",  destination: "Tails & Whiskers",    updated: "Mar 20" },
  { id: "LP-034", status: "Screening",  qty: "120 packs", destination: "Bark Park Sanctuary", updated: "Mar 17" },
  { id: "LP-058", status: "Processing", qty: "80 packs",  destination: "Furry Friends Haven", updated: "Mar 08" },
];

const navTop = [
  { label: "Home",      href: "/home"       },
  { label: "Dashboard", href: "/dash"       },
  { label: "Create Lot",href: "/create"     },
  { label: "Donations", href: "/create-lot" },
  { label: "Reports",   href: "/reports"    },
  { label: "Settings",  href: "/settings"   },
];

/* ─── ICONS ─── */
const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="9" fill="#2D6A4F"/>
    <path d="M19 8C19 8 11 14.5 11 22.5a8 8 0 0016 0C27 14.5 19 8 19 8z" fill="white" opacity="0.92"/>
    <path d="M19 13C19 13 14 18 14 23a5 5 0 0010 0C24 18 19 13 19 13z" fill="#B7E4C7"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#52B788" strokeWidth="1.7"/>
    <path d="M2 7l10 7 10-7" stroke="#52B788" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C8.6 21 3 15.4 3 6a2 2 0 012-2z"
      stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" stroke="#52B788" strokeWidth="1.6"/>
    <circle cx="12" cy="9" r="2.5" fill="#52B788"/>
  </svg>
);
const FbIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TwIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="white" strokeWidth="1.8"/>
  </svg>
);

function pillClass(status) {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return "pill--delivered";
  if (s.includes("screen"))    return "pill--screening";
  if (s.includes("process"))   return "pill--processing";
  return "pill--default";
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [newsEmail, setNewsEmail]     = useState("");
  const navigate = useNavigate();

  const lots = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lotsSeed;
    return lotsSeed.filter((l) => l.id.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="slfd">

      {/* ══════════ TOP NAV ══════════ */}
      <header className="slfdTopNav">
        <div className="slfdTopLeft">
          <button className="slfdBurger" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <button className="slfdBrand" onClick={() => navigate("/home")}>
            <LogoIcon />
            <span className="slfdBrandText">SecondLife <strong>Foods</strong></span>
          </button>
          <nav className="slfdTopLinks">
            {navTop.map((i) => (
              <a key={i.label} href={i.href}>{i.label}</a>
            ))}
          </nav>
        </div>
        <div className="slfdTopRight">
          <button className="slfdNewLot" onClick={() => navigate("/create")}>+ New Lot</button>
          <div className="slfdAvatar" title="Profile"><span>👤</span></div>
        </div>
      </header>

      <div className="slfdBody">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className={`slfdSide ${sidebarOpen ? "open" : ""}`}>
          <div className="slfdSideHeader">
            <div className="slfdOrgChip">
              <div className="slfdOrgPic">👤</div>
              <div className="slfdOrgMeta">
                <div className="slfdOrgName">John's Shelter</div>
                <div className="slfdOrgMail">john@shelter.org</div>
              </div>
            </div>
          </div>
          <div className="slfdSideNav">
            <a className="active" href="/dash">Dashboard</a>
            <a href="/create">Create Lot</a>
            <a href="/create-lot">My Donations</a>
            <a href="/qr">QR Search</a>
            <a href="/account">Account</a>
          </div>
        </aside>

        {/* ══════════ MAIN ══════════ */}
        <main className="slfdMain">

          <section className="slfdWelcome">
            <div>
              <h1 className="slfdTitle">Welcome back, John <span className="slfdWave">👋</span></h1>
              <p className="slfdSub">Here's an overview of your recent activity.</p>
            </div>
          </section>

          <section className="slfdKpis">
            <div className="slfdCard slfdKpi">
              <div className="slfdKpiTop"><span className="slfdKpiIcon">📦</span><span className="slfdKpiLabel">Lots Donated</span></div>
              <div className="slfdKpiValue">24</div>
              <div className="slfdKpiNote">+ 5 this month</div>
            </div>
            <div className="slfdCard slfdKpi">
              <div className="slfdKpiTop"><span className="slfdKpiIcon">🍲</span><span className="slfdKpiLabel">Total Meals Provided</span></div>
              <div className="slfdKpiValue">3,850</div>
              <div className="slfdKpiNote">+ 950 meals</div>
            </div>
            <div className="slfdCard slfdKpi">
              <div className="slfdKpiTop"><span className="slfdKpiIcon">🌿</span><span className="slfdKpiLabel">CO2e Diverted</span></div>
              <div className="slfdKpiValue">1.4 tons</div>
              <div className="slfdKpiNote">- 0.3 tons</div>
            </div>
          </section>

          <section className="slfdGrid">

            {/* LOTS TABLE */}
            <div className="slfdCard slfdLots">
              <div className="slfdCardHead">
                <div className="slfdCardTitle">Your Lots</div>
                <div className="slfdSearchWrap">
                  <span className="slfdSearchIcon">⌕</span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} className="slfdSearch" placeholder="Search by Lot ID..." />
                </div>
              </div>
              <div className="slfdTableWrap">
                <table className="slfdTable">
                  <thead>
                    <tr><th>Lot ID</th><th>Status</th><th>Quantity</th><th>Destination</th><th>Last Updated</th></tr>
                  </thead>
                  <tbody>
                    {lots.map((l) => (
                      <tr key={l.id}>
                        <td className="mono">{l.id}</td>
                        <td><span className={`pill ${pillClass(l.status)}`}>{l.status}</span></td>
                        <td>{l.qty}</td><td>{l.destination}</td><td>{l.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="slfdLinkBtn" onClick={() => navigate("/track")}>View All Lots →</button>
            </div>

            {/* RIGHT COL */}
            <div className="slfdRightCol">
              <div className="slfdCard">
                <div className="slfdCardHead compact">
                  <div className="slfdCardTitle">QR Search</div>
                  <button className="slfdSmallBtn" onClick={() => navigate("/qr")}>Scan QR</button>
                </div>
                <div className="slfdQrRow">
                  <input className="slfdInput" placeholder="Search by Lot ID..." />
                  <button className="slfdSmallBtn solid">Search</button>
                </div>
              </div>

              <div className="slfdCard">
                <div className="slfdCardHead compact">
                  <div className="slfdCardTitle">Notifications</div>
                  <button className="slfdLinkMini">View All</button>
                </div>
                <div className="slfdNotiList">
                  <div className="slfdNoti">
                    <div className="dot delivered" />
                    <div>
                      <div className="slfdNotiText">Lot <b>LP-002</b> was delivered to <b>Sheltered Paws</b></div>
                      <div className="slfdNotiTime">Mar 24</div>
                    </div>
                  </div>
                  <div className="slfdNoti">
                    <div className="dot screening" />
                    <div>
                      <div className="slfdNotiText">Screening in progress for Lot <b>LP-034</b></div>
                      <div className="slfdNotiTime">Mar 21</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="slfdCard">
                <div className="slfdCardHead compact">
                  <div className="slfdCardTitle">Next Pickup</div>
                  <span className="slfdMuted">Last 6 months</span>
                </div>
                <div className="slfdPickup">
                  <div className="slfdPickupTop">
                    <div>
                      <div className="slfdPickupName">Sheltered Paws</div>
                      <div className="slfdPickupAddr">123 Furry Lane</div>
                    </div>
                    <button className="slfdSmallBtn">View Details</button>
                  </div>
                  <div className="slfdMiniChart" aria-hidden="true">
                    <svg viewBox="0 0 300 90" preserveAspectRatio="none">
                      <path d="M0,70 C40,55 60,58 90,50 C125,40 150,45 180,34 C210,22 240,26 300,12 L300,90 L0,90 Z" fill="rgba(47,125,90,.14)"/>
                      <path d="M0,70 C40,55 60,58 90,50 C125,40 150,45 180,34 C210,22 240,26 300,12" fill="none" stroke="rgba(47,125,90,.85)" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="slfdMiniAxis">
                      <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPACT */}
            <div className="slfdCard slfdImpact">
              <div className="slfdCardHead compact">
                <div className="slfdCardTitle">Impact Overview</div>
                <span className="slfdMuted">Last 6 months</span>
              </div>
              <div className="slfdImpactRow">
                <div className="slfdImpactBox">
                  <div className="slfdImpactLabel">To Date</div>
                  <div className="slfdImpactValue">37</div>
                  <div className="slfdImpactSub">Lots</div>
                </div>
                <div className="slfdImpactBox">
                  <div className="slfdImpactLabel">This Month</div>
                  <div className="slfdImpactValue">4.8 tons</div>
                  <div className="slfdImpactSub">Waste diverted</div>
                </div>
                <div className="slfdImpactBadge">
                  <div className="slfdSdgPill"><span className="slfdSdgDot" />SDG 12 Compliant</div>
                  <div className="slfdImpactNote">Verified tracking + controlled redistribution.</div>
                </div>
              </div>
            </div>

          </section>
        </main>

        {sidebarOpen && (
          <button className="slfdOverlay" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          FOOTER — pixel-perfect match to screenshot
      ══════════════════════════════════════════════════════ */}
      <footer className="slfd-footer">
        <div className="slfd-footer-main">

          {/* Col 1 — Brand */}
          <div className="slfd-footer-brand">
            <div className="slfd-footer-logo">
              <LogoIcon />
              <span className="slfd-footer-logo-text">SecondLife <strong>Foods</strong></span>
            </div>
            <p className="slfd-footer-tagline">
              Transforming expired, packaged goods<br />
              into valuable resources to reduce food<br />
              waste and nourish animals.
            </p>
            <div className="slfd-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="slfd-social-btn" aria-label="Facebook"><FbIcon /></a>
              <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="slfd-social-btn" aria-label="Twitter"><TwIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="slfd-social-btn" aria-label="LinkedIn"><LiIcon /></a>
            </div>
          </div>

          {/* Col 2 — Contact */}
          <div className="slfd-footer-col">
            <h4 className="slfd-footer-col-title">Contact</h4>
            <ul className="slfd-footer-contact">
              <li><MailIcon /><a href="mailto:contact@secondlifefoods.org">contact@secondlifefoods.org</a></li>
              <li><PhoneIcon /><a href="tel:+11234567890">+1 (123) 456-7890</a></li>
              <li><PinIcon /><span>123 Green St.<br />Cityname, ST 12345</span></li>
            </ul>
          </div>

          {/* Col 3 — Quick Links */}
          <div className="slfd-footer-col">
            <h4 className="slfd-footer-col-title">Quick Links</h4>
            <ul className="slfd-footer-links">
              <li><a href="/home">Home</a></li>
              <li><a href="/create-lot">Donate Food Lot</a></li>
              <li><a href="/create">Create Lot</a></li>
              <li><a href="/track">Track Lot</a></li>
            </ul>
          </div>

          {/* Col 4 — Resources */}
          <div className="slfd-footer-col">
            <h4 className="slfd-footer-col-title">Resources</h4>
            <ul className="slfd-footer-links">
              <li><a href="/knowledge">Knowledge Pocket</a></li>
              <li><a href="/qr">QR Scanner</a></li>
              <li><a href="/admin">Admin Panel</a></li>
              <li><a href="/testing">Testing Screen</a></li>
            </ul>
          </div>

          {/* Col 5 — Newsletter */}
          <div className="slfd-footer-col">
            <h4 className="slfd-footer-col-title">Newsletter</h4>
            <p className="slfd-footer-news-desc">Subscribe to our newsletter</p>
            <form className="slfd-footer-news-form" onSubmit={(e) => { e.preventDefault(); setNewsEmail(""); }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="slfd-footer-bottom">
          <p>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</p>
          <div className="slfd-footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="slfd-sep">|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}