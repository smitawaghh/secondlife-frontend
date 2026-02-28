import React, { useState } from "react";
import "./Home.css";
import heroImg from "./assets/processing-hub.png";

/* ── ICONS ── */
const LogoIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#2D6A4F" />
    <path d="M19 8C19 8 11 14.5 11 22.5a8 8 0 0016 0C27 14.5 19 8 19 8z" fill="white" opacity="0.9" />
    <path d="M19 13C19 13 14 18 14 23a5 5 0 0010 0C24 18 19 13 19 13z" fill="#74C69D" />
    <line x1="19" y1="8" x2="19" y2="30" stroke="white" strokeWidth="1.2" opacity="0.35" />
  </svg>
);

const LogoIconSmall = () => (
  <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#52B788" />
    <path d="M19 8C19 8 11 14.5 11 22.5a8 8 0 0016 0C27 14.5 19 8 19 8z" fill="white" opacity="0.9" />
    <path d="M19 13C19 13 14 18 14 23a5 5 0 0010 0C24 18 19 13 19 13z" fill="#B7E4C7" />
    <line x1="19" y1="8" x2="19" y2="30" stroke="white" strokeWidth="1.2" opacity="0.35" />
  </svg>
);

const UpArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RightArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="#2D6A4F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#2D6A4F" />
    <path d="M8 6.5L14 10L8 13.5V6.5Z" fill="white" />
  </svg>
);

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2C11 2 3 8 3 14.5a8 8 0 0016 0C19 8 11 2 11 2z" fill="#52B788" opacity="0.9" />
    <line x1="11" y1="3" x2="11" y2="20" stroke="white" strokeWidth="1.1" opacity="0.5" />
  </svg>
);

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="1" y="7" width="13" height="10" rx="2" fill="#52B788" />
    <path d="M14 10h3.5l2.5 3.5V17h-6V10z" fill="#40916C" />
    <circle cx="5" cy="18" r="2.2" fill="#2D6A4F" />
    <circle cx="17" cy="18" r="2.2" fill="#2D6A4F" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2L3 5.5v5.5c0 4.8 3.3 8.9 8 10 4.7-1.1 8-5.2 8-10V5.5L11 2z" fill="#52B788" />
    <path d="M7.5 11l2.5 2.5L15 8" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QRIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="2" y="2" width="8" height="8" rx="1.5" fill="#52B788" />
    <rect x="12" y="2" width="8" height="8" rx="1.5" fill="#52B788" />
    <rect x="2" y="12" width="8" height="8" rx="1.5" fill="#52B788" />
    <rect x="4" y="4" width="4" height="4" fill="white" rx="0.5" />
    <rect x="14" y="4" width="4" height="4" fill="white" rx="0.5" />
    <rect x="4" y="14" width="4" height="4" fill="white" rx="0.5" />
    <rect x="12" y="12" width="3" height="3" fill="#52B788" rx="0.5" />
    <rect x="17" y="12" width="3" height="3" fill="#52B788" rx="0.5" />
    <rect x="12" y="17" width="3" height="3" fill="#52B788" rx="0.5" />
    <rect x="17" y="17" width="3" height="3" fill="#52B788" rx="0.5" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 2.5A1.5 1.5 0 014.5 1h7A1.5 1.5 0 0113 2.5v11a.5.5 0 01-.765.424L8 11.399l-4.235 2.025A.5.5 0 013 13.5v-11z" fill="#52B788"/>
  </svg>
);

const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 4V2.5A1.5 1.5 0 012.5 1H4M12 1h1.5A1.5 1.5 0 0115 2.5V4M1 12v1.5A1.5 1.5 0 002.5 15H4M12 15h1.5A1.5 1.5 0 0015 13.5V12" stroke="#52B788" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="5" y="5" width="6" height="6" rx="1" fill="#52B788" opacity="0.3"/>
    <line x1="1" y1="8" x2="15" y2="8" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChatBotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.921 1.408 5.53 3.618 7.26L4.5 22l4.262-1.9A11.16 11.16 0 0012 20.485c5.523 0 10-4.144 10-9.242S17.523 2 12 2z" fill="white"/>
    <circle cx="8" cy="11" r="1.3" fill="#2D6A4F"/>
    <circle cx="12" cy="11" r="1.3" fill="#2D6A4F"/>
    <circle cx="16" cy="11" r="1.3" fill="#2D6A4F"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 5l10 10M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ── FOOTER ICONS ── */
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="#74C69D" strokeWidth="1.6"/>
    <path d="M2 7l8 5 8-5" stroke="#74C69D" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
    <path d="M4 2h4l2 5-2.5 1.5a11 11 0 005 5L14 11l5 2v4a2 2 0 01-2 2C7.6 19 1 12.4 1 4a2 2 0 012-2z" stroke="#74C69D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="#74C69D" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    <circle cx="10" cy="8" r="2" fill="#74C69D"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="white" strokeWidth="1.8"/>
  </svg>
);

const NAV = [
  { label: "Home",              href: "/home",         active: true  },
  { label: "Donor Dashboard",   href: "/dash",         active: false },
  { label: "Create Lot",        href: "/create",       active: false },
 // { label: "Knowledge Pocket",  href: "/knowledge",    active: false },
  { label: "QR Scanner",        href: "/",   active: false },
  { label: "Admin Panel",       href: "/admin",        active: false },
  { label: "Testing Screen",    href: "/testing",      active: false },
];

const INFO_CARDS = [
  { icon: <LeafIcon />,   title: "Zero Waste Mission",    desc: "We recover chemically-stable packaged goods past sell-by dates, giving them a second life instead of landfill." },
  { icon: <TruckIcon />,  title: "Direct Redistribution", desc: "Donated lots are routed directly to licensed animal shelters and certified feed producers within 48 hours." },
  { icon: <ShieldIcon />, title: "Safety Screened",       desc: "Every lot is screened for chemical stability and compliance before being approved for animal consumption." },
  { icon: <QRIcon />,     title: "Full QR Traceability",  desc: "Scan any lot QR code to see the complete chain of custody from donor to recipient in real-time." },
];

const BOTPRESS_URL =
  "https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/02/19/06/20260219060449-KOU3JOYE.json";

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [email, setEmail] = useState("");

  const handleChatToggle = () => {
    if (!chatOpen && !chatLoaded) setChatLoaded(true);
    setChatOpen(prev => !prev);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Subscribed with ${email}!`);
      setEmail("");
    }
  };

  return (
    <div className="page">

      {/* ════════ NAVBAR ════════ */}
      <nav className="navbar">
        <a href="/" className="logo">
          <LogoIcon />
          <span className="logo-text">SecondLife <strong>Foods</strong></span>
        </a>
        <ul className="nav-menu">
          {NAV.map(n => (
            <li key={n.label}>
              <a
                href={n.href}
                className={`nav-link${n.active ? " active" : ""}${n.highlight ? " nav-link--highlight" : ""}`}
              >
                {n.icon && <span className="nav-icon">{n.icon}</span>}
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-auth">
          <a href="/login"  className="btn-outline">Login</a>
          <a href="/signup" className="btn-fill">Sign Up</a>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge">
            <span className="badge-dot" />
            WASTE-TO-VALUE PLATFORM
          </div>

          <h1 className="headline">
            Expired doesn't<br />
            mean <em>worthless.</em>
          </h1>

          <p className="hero-body">
            We redirect chemically-stable packaged goods past their sell-by date
            to animal shelters and licensed feed producers —{" "}
            <strong className="green-bold">turning discarded supply chains</strong>{" "}
            into living ecosystems.
          </p>

          <div className="cta-row">
            <a href="/create-lot" className="cta-primary">Donate Food Lot <UpArrow /></a>
            <a href="/track"      className="cta-secondary">Track Lot <RightArrow /></a>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImg} alt="SecondLife Foods processing hub" className="hero-img" />
          <div className="fade fade-left"   />
          <div className="fade fade-top"    />
          <div className="fade fade-bottom" />
          <div className="fade fade-right"  />
        </div>
      </section>

      {/* ════════ INFO SECTION ════════ */}
      <section className="info-section">
        <div className="info-header">
          <span className="info-tag">HOW IT WORKS</span>
          <h2 className="info-title">From expiry shelf to <em>living purpose</em></h2>
          <p className="info-subtitle">
            SecondLife Foods bridges the gap between surplus supply chains and
            animals that need nourishment — sustainably and traceably.
          </p>
        </div>

        <div className="cards-grid">
          {INFO_CARDS.map((c, i) => (
            <div key={i} className="info-card">
              <div className="card-icon">{c.icon}</div>
              <h3 className="card-title">{c.title}</h3>
              <p className="card-desc">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="video-cta">
          <div className="video-inner">
            <div className="video-text">
              <p className="video-label">Want to know more?</p>
              <h3 className="video-title">Watch how SecondLife Foods works</h3>
              <p className="video-desc">
                See the full journey — from a donor scanning expired goods to an
                animal shelter receiving a certified lot the same day.
              </p>
            </div>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
               target="_blank" rel="noreferrer" className="video-btn">
              <PlayIcon /> Watch the Video
            </a>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="footer">
        <div className="footer-main">

          {/* Col 1 — Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <LogoIconSmall />
              <span className="footer-logo-text">SecondLife <strong>Foods</strong></span>
            </div>
            <p className="footer-tagline">
              Transforming expired, packaged goods into valuable resources to reduce food waste and nourish animals.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter"><TwitterIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="LinkedIn"><LinkedInIcon /></a>
            </div>
          </div>

          {/* Col 2 — Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <MailIcon />
                <a href="mailto:contact@secondlifefoods.org">contact@secondlifefoods.org</a>
              </li>
              <li>
                <PhoneIcon />
                <a href="tel:+11234567890">+1 (123) 456-7890</a>
              </li>
              <li>
                <PinIcon />
                <span>123 Green St.<br />Cityname, ST 12345</span>
              </li>
            </ul>
          </div>

          {/* Col 3 — Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/home">Home</a></li>
              <li><a href="/create-lot">Donate Food Lot</a></li>
              <li><a href="/create">Create Lot</a></li>
              <li><a href="/track">Track Lot</a></li>
            </ul>
          </div>

          {/* Col 4 — Resources */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="/knowledge">Knowledge Pocket</a></li>
              <li><a href="/qr-scanner">QR Scanner</a></li>
              <li><a href="/admin">Admin Panel</a></li>
              <li><a href="/testing">Testing Screen</a></li>
            </ul>
          </div>

          {/* Col 5 — Newsletter */}
          <div className="footer-col footer-newsletter">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="footer-newsletter-desc">Subscribe to our newsletter</p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="footer-bottom">
          <p>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ════════ CHATBOT ════════ */}
      <button
        className={`chat-fab${chatOpen ? " chat-fab--open" : ""}`}
        onClick={handleChatToggle}
        aria-label={chatOpen ? "Close chat" : "Open chat assistant"}
      >
        <span className="chat-fab-icon chat-fab-icon--open"><ChatBotIcon /></span>
        <span className="chat-fab-icon chat-fab-icon--close"><CloseIcon /></span>
        {!chatOpen && <span className="chat-fab-label">Ask AI</span>}
        {!chatOpen && <span className="chat-fab-pulse" />}
      </button>

      <div className={`chat-panel${chatOpen ? " chat-panel--visible" : ""}`}>
        <div className="chat-panel-header">
          <div className="chat-panel-header-left">
            <div className="chat-panel-avatar">
              <ChatBotIcon />
            </div>
            <div>
              <p className="chat-panel-title">SecondLife Assistant</p>
              <p className="chat-panel-status"><span className="chat-status-dot" />Online</p>
            </div>
          </div>
          <button className="chat-panel-close" onClick={handleChatToggle} aria-label="Close chat">
            <CloseIcon />
          </button>
        </div>

        <div className="chat-panel-body">
          {chatLoaded ? (
            <iframe
              src={BOTPRESS_URL}
              title="SecondLife AI Chat Assistant"
              className="chat-iframe"
              allow="microphone"
            />
          ) : null}
        </div>
      </div>

      {chatOpen && <div className="chat-backdrop" onClick={handleChatToggle} />}

    </div>
  );
};

export default Home;