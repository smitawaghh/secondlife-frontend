import React, { useState } from "react";
import "./Donation.css";

/* ── ICONS ── */
const HeartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#fff" stroke="#fff" strokeWidth="1.2"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="#fff" strokeWidth="1.8"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const PawIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <ellipse cx="6" cy="7" rx="2" ry="2.5" fill="currentColor"/>
    <ellipse cx="18" cy="7" rx="2" ry="2.5" fill="currentColor"/>
    <ellipse cx="10" cy="5" rx="2" ry="2.5" fill="currentColor"/>
    <ellipse cx="14" cy="5" rx="2" ry="2.5" fill="currentColor"/>
    <path d="M12 9c-3.5 0-6 2.5-6 5.5 0 2 1.5 4.5 6 4.5s6-2.5 6-4.5C18 11.5 15.5 9 12 9z" fill="currentColor"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8.5" fill="#e6f4ec" stroke="#b2dbc0"/>
    <path d="M5 9l2.8 2.8L13 6" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIconWhite = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.15)"/>
    <path d="M5 9l2.8 2.8L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#52B788" strokeWidth="1.7"/>
    <path d="M2 7l10 7 10-7" stroke="#52B788" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C8.6 21 3 15.4 3 6a2 2 0 012-2z" stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.53 3.67 1.44 5.19L2 22l4.94-1.42A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#52B788"/>
    <path d="M8.5 9.5c.5 1 1.5 3 3.5 4.5 1 .8 2.5 1.5 3 1 .3-.3.5-1 .5-1s-1-1-1.5-1.5c-.3-.3-.7 0-1 .3-.2.2-.5.2-.7 0-.5-.5-1.5-1.5-2-2.5-.2-.3-.1-.6.1-.8.3-.3.6-.6.3-1L10 7c-.3-.3-1-.2-1.3.2-.5.7-.7 1.6-.2 2.3z" fill="white"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="9" fill="#2D6A4F"/>
    <path d="M19 8C19 8 11 14.5 11 22.5a8 8 0 0016 0C27 14.5 19 8 19 8z" fill="white" opacity="0.92"/>
    <path d="M19 13C19 13 14 18 14 23a5 5 0 0010 0C24 18 19 13 19 13z" fill="#B7E4C7"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="white" strokeWidth="1.8"/>
  </svg>
);

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" stroke="#52B788" strokeWidth="1.6"/>
    <circle cx="12" cy="9" r="2.5" fill="#52B788"/>
  </svg>
);

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9bb5a3" strokeWidth="1.6"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="#9bb5a3" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#9bb5a3" strokeWidth="1.6"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9bb5a3" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const CamIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#2D6A4F" strokeWidth="1.6"/>
    <circle cx="12" cy="13" r="4" stroke="#2D6A4F" strokeWidth="1.6"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V6l-8-4z" stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─────────────────────────────────────────────── */

const STORIES = [
  {
    id: 1,
    img: "https://png.pngtree.com/png-vector/20241111/ourmid/pngtree-playful-cartoon-dog-with-green-face-png-image_14335128.png",
    tag: "Man's Best Friend",
    emoji: "🐕",
    title: "Every meal means one more day of hope.",
    story: "Thousands of stray dogs roam city streets surviving on scraps. Your expired dry goods — rice, kibble, packaged meals — are chemically stable and perfectly safe for them. One donated lot feeds an entire shelter pack for a week.",
    stat1: { val: "2.4M", label: "stray dogs in India" },
    stat2: { val: "78%", label: "fed via food donations" },
    flip: false,
  },
  {
    id: 2,
    img: "https://png.pngtree.com/png-clipart/20250107/original/pngtree-adorable-cartoon-cat-with-green-eyes-png-image_18835388.png",
    tag: "Feline Friends",
    emoji: "🐈",
    title: "Small paws, big hunger — your surplus saves them.",
    story: "Feral cats and rescue kittens at shelters often go underfed due to budget constraints. Canned goods and packaged fish meals past sell-by dates are still full of nutrition. They don't know the difference — they just know they're not hungry.",
    stat1: { val: "4.1M", label: "feral cats need help" },
    stat2: { val: "60 kg", label: "feeds a shelter monthly" },
    flip: true,
  },
  {
    id: 3,
    img: "https://static.vecteezy.com/system/resources/previews/062/438/532/non_2x/happy-green-cartoon-parrot-character-with-open-wings-vector.jpg",
    tag: "Feathered Friends",
    emoji: "🦜",
    title: "Wings to fly — if only they had food to thrive.",
    story: "Rescue birds and parrots in avian shelters rely on donated seed mixes, packaged grains, and dry goods. Expired cereals and bulk grains retain full nutritional value. Your surplus gives these birds the energy to heal and fly free.",
    stat1: { val: "85K+", label: "birds in rescue centres" },
    stat2: { val: "3 days", label: "lot delivery turnaround" },
    flip: false,
  },
];

const AMOUNTS = [100, 250, 500, 1000, 2500];
const CATEGORIES = ["Dry goods", "Packaged", "Canned", "Pet Food"];
const STEPS = ["Details", "Compliance", "Pickup", "Review"];

const TRUST_BAR_ITEMS = [
  "🐕 4,200 dogs fed this month",
  "🐈 1,800 cats helped",
  "🦜 620 birds nourished",
  "📦 38 tonnes diverted from landfill",
  "🤝 112 active donors",
  "❤️ 6 partner shelters",
];

export default function Donation() {
  const [donationType, setDonationType] = useState("food");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [newsEmail, setNewsEmail] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [foodForm, setFoodForm] = useState({
    productName: "", quantity: "", unit: "kg", expiryDate: "", mfgDate: ""
  });
  const [donorForm, setDonorForm] = useState({ name: "", email: "", phone: "" });
  const [pickupForm, setPickupForm] = useState({ address: "", date: "", time: "9:00 AM – 12:00 PM" });

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const getImpactText = (amt) => {
    if (amt >= 1000) return `₹${amt} feeds a shelter pack for ${Math.round(amt / 200)} days 🐕`;
    if (amt >= 250) return `₹${amt} provides ${Math.round(amt / 50)} meals for rescue cats 🐈`;
    return `₹${amt} covers transport for 1 food lot 📦`;
  };

  return (
    <div className="don-page">

      {/* ══ NAV ══ */}
      <nav className="don-nav">
        {/* Logo */}
        <a href="/home" className="don-nav-logo">
          <LogoIcon />
          <span className="don-nav-logo-text">SecondLife <strong>Foods</strong></span>
        </a>

        {/* Center links — exact match to screenshot */}
        <div className="don-nav-center">
          <a href="/home"             className="don-nav-link active">Home</a>
          <a href="/dash"  className="don-nav-link">Donor Dashboard</a>
          <a href="/create"       className="don-nav-link">Create Lot</a>
         
          <a href="/qr"       className="don-nav-link">QR Scanner</a>
          <a href="/admin"            className="don-nav-link">Admin Panel</a>
          <a href="/testing"          className="don-nav-link">Testing Screen</a>
        </div>

        {/* Right side */}
        <div className="don-nav-right">
          <a href="#donate-form" className="don-nav-cta">
            Donate Now
          </a>
          {/* Hamburger for mobile */}
          <button
            className="don-nav-hamburger"
            onClick={() => setMobileNavOpen(o => !o)}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`don-nav-drawer ${mobileNavOpen ? "open" : ""}`}>
        <a href="/home">Home</a>
        <a href="/donor-dashboard">Donor Dashboard</a>
        <a href="/create-lot">Create Lot</a>
        <a href="/knowledge">Knowledge Pocket</a>
        <a href="/qr-scanner">QR Scanner</a>
        <a href="/admin">Admin Panel</a>
        <a href="/testing">Testing Screen</a>
        <div className="don-nav-drawer-divider" />
        <a href="#donate-form" className="don-nav-drawer-cta"
          onClick={() => setMobileNavOpen(false)}>Donate Now</a>
      </div>

      {/* ══ HERO ══ */}
      <section className="don-hero">
        <div className="don-hero-overlay" />
        <div className="don-hero-content">
          <span className="don-hero-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="don-hero-eyebrow-dot" />
            SecondLife Foods · Animal Welfare Initiative
          </span>
          <h1 className="don-hero-title">
            Your surplus is<br /><em>their survival.</em>
          </h1>
          <p className="don-hero-sub">
            Every expired packet you donate becomes a meal for a stray dog, a shelter cat,
            or a rescued bird. Safe. Verified. Life-changing.
          </p>
          <div className="don-hero-actions">
            <a href="#donate-form" className="don-hero-cta-primary">
              Donate Now <ArrowRight />
            </a>
            <a href="#stories" className="don-hero-cta-ghost">
              See Who You're Helping
            </a>
          </div>
          <div className="don-hero-stats">
            <div className="don-hero-stat">
              <span className="don-hero-stat-val">38T</span>
              <span className="don-hero-stat-label">Food diverted monthly</span>
            </div>
            <div className="don-hero-stat-div" />
            <div className="don-hero-stat">
              <span className="don-hero-stat-val">6,620</span>
              <span className="don-hero-stat-label">Animals fed this month</span>
            </div>
            <div className="don-hero-stat-div" />
            <div className="don-hero-stat">
              <span className="don-hero-stat-val">6</span>
              <span className="don-hero-stat-label">Verified partner shelters</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST BAR (replaces ticker) ══ */}
      <div className="don-trust-bar">
        {TRUST_BAR_ITEMS.map((item, i) => (
          <span key={i} className="don-trust-bar-item">
            <span className="don-trust-bar-dot" />
            {item}
          </span>
        ))}
      </div>

      {/* ══ ANIMAL STORIES ══ */}
      <section className="don-stories" id="stories">
        <div className="don-stories-header">
          <span className="don-section-label">Who You're Helping</span>
          <h2 className="don-stories-title">Meet the ones waiting for your donation</h2>
          <p className="don-stories-sub">
            Real shelters. Real animals. Your food donation makes an immediate, measurable difference.
          </p>
        </div>

        {STORIES.map((s) => (
          <div key={s.id} className={`don-story ${s.flip ? "don-story--flip" : ""}`}>
            <div className="don-story-img-wrap">
              <div className="don-story-img-bg">
                <img src={s.img} alt={s.tag} className="don-story-img" />
              </div>
              <span className="don-story-img-tag">{s.emoji} {s.tag}</span>
            </div>
            <div className="don-story-text">
              <h3 className="don-story-title">{s.title}</h3>
              <p className="don-story-body">{s.story}</p>
              <div className="don-story-stats">
                <div className="don-stat">
                  <span className="don-stat-val">{s.stat1.val}</span>
                  <span className="don-stat-label">{s.stat1.label}</span>
                </div>
                <div className="don-stat-div" />
                <div className="don-stat">
                  <span className="don-stat-val">{s.stat2.val}</span>
                  <span className="don-stat-label">{s.stat2.label}</span>
                </div>
              </div>
              <ul className="don-bullets">
                <li><CheckIcon /> Chemically stable expired food is safe for animals</li>
                <li><CheckIcon /> Verified by licensed feed producers &amp; vets</li>
                <li><CheckIcon /> QR-tracked from donor door to shelter bowl</li>
              </ul>
              <a href="#donate-form" className="don-story-cta">
                Donate for {s.tag} <ArrowRight />
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* ══ DONATION SECTION ══ */}
      <section className="don-section" id="donate-form">
        <div className="don-section-header">
          <span className="don-section-label">Make a Donation</span>
          <h2 className="don-section-title">Choose how you'd like to help</h2>
          <p className="don-section-sub">
            Donate surplus food directly or contribute funds — every form of support reaches verified shelters.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="don-tabs">
          <button
            type="button"
            className={`don-tab ${donationType === "food" ? "active" : ""}`}
            onClick={() => { setDonationType("food"); setStep(1); setSubmitted(false); }}>
            <BoxIcon /> Donate Food / Lot
          </button>
          <button
            type="button"
            className={`don-tab ${donationType === "money" ? "active" : ""}`}
            onClick={() => { setDonationType("money"); setSubmitted(false); }}>
            <HeartIcon /> Donate Money
          </button>
        </div>

        {/* ─── FOOD LOT FORM ─── */}
        {donationType === "food" && (
          <div className="don-food-outer">
            <div className="don-food-header">
              <h2 className="don-food-title">Donate a Food Lot</h2>
              <p className="don-food-sub">Turn your surplus into sustenance for animals in need.</p>
            </div>

            {/* Step progress */}
            <div className="don-stepper">
              {STEPS.map((label, i) => {
                const n = i + 1;
                const status = step === n ? "active" : step > n ? "done" : "idle";
                return (
                  <div key={i} className={`don-stepper-item ${status}`}>
                    <div className="don-stepper-num">
                      {status === "done" ? "✓" : n}
                    </div>
                    <span className="don-stepper-label">{label}</span>
                  </div>
                );
              })}
            </div>

            {submitted ? (
              <div className="don-food-card">
                <div className="don-success">
                  <div className="don-success-icon">🎉</div>
                  <h3>Donation Submitted!</h3>
                  <p>Our team will verify and assign your lot to a licensed shelter within 48 hours. You'll receive a confirmation email shortly.</p>
                  <button
                    className="don-btn-primary"
                    style={{ width: "auto", padding: "12px 32px" }}
                    onClick={() => { setSubmitted(false); setStep(1); }}>
                    Donate Another Lot
                  </button>
                </div>
              </div>
            ) : (
              <div className="don-food-card">

                {/* STEP 1 */}
                {step === 1 && (
                  <form className="don-step-form" onSubmit={e => { e.preventDefault(); setStep(2); }}>
                    <h3 className="don-step-heading">Product Details</h3>

                    <div className="don-field">
                      <label className="don-label">Product Name</label>
                      <input
                        className="don-input"
                        placeholder="e.g. Royal Canin Adult Dry Food"
                        value={foodForm.productName}
                        onChange={e => setFoodForm({ ...foodForm, productName: e.target.value })}
                        required />
                    </div>

                    <div className="don-field">
                      <label className="don-label">Category</label>
                      <div className="don-cat-row">
                        {CATEGORIES.map(c => (
                          <button key={c} type="button"
                            className={`don-cat-pill ${selectedCategory === c ? "active" : ""}`}
                            onClick={() => setSelectedCategory(c)}>{c}</button>
                        ))}
                      </div>
                    </div>

                    <div className="don-row-halves">
                      <div className="don-field">
                        <label className="don-label">Quantity</label>
                        <div className="don-qty-wrap">
                          <span className="don-input-pfx"><UserIcon /></span>
                          <input
                            className="don-input don-input-mid"
                            type="number"
                            placeholder="0"
                            value={foodForm.quantity}
                            onChange={e => setFoodForm({ ...foodForm, quantity: e.target.value })}
                            required />
                          <select
                            className="don-unit-sel"
                            value={foodForm.unit}
                            onChange={e => setFoodForm({ ...foodForm, unit: e.target.value })}>
                            <option>kg</option>
                            <option>cartons</option>
                            <option>pallets</option>
                            <option>units</option>
                          </select>
                        </div>
                      </div>
                      <div className="don-field">
                        <label className="don-label">Expiry Date</label>
                        <div className="don-qty-wrap">
                          <span className="don-input-pfx"><CalIcon /></span>
                          <input
                            className="don-input don-input-mid"
                            type="date"
                            value={foodForm.expiryDate}
                            onChange={e => setFoodForm({ ...foodForm, expiryDate: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <div className="don-field">
                      <label className="don-label">Manufacturing Date</label>
                      <div className="don-qty-wrap">
                        <span className="don-input-pfx"><CalIcon /></span>
                        <input
                          className="don-input don-input-mid"
                          type="date"
                          value={foodForm.mfgDate}
                          onChange={e => setFoodForm({ ...foodForm, mfgDate: e.target.value })} />
                      </div>
                    </div>

                    <div className="don-field don-upload-field">
                      <label className="don-label">Product Image (optional)</label>
                      <label className="don-upload-btn">
                        <CamIcon /> Choose File
                        <input type="file" accept="image/*" style={{ display: "none" }} />
                      </label>
                    </div>

                    <button type="submit" className="don-btn-primary don-btn-full">
                      Continue: Compliance <ArrowRight />
                    </button>
                    <div className="don-form-note">
                      <span className="don-note-dot" />
                      Once submitted, your lot will be verified and assigned to licensed partner shelters within 48 hours.
                    </div>
                  </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <form className="don-step-form" onSubmit={e => { e.preventDefault(); setStep(3); }}>
                    <h3 className="don-step-heading">Compliance & Safety</h3>
                    <div className="don-field">
                      <label className="don-label">Storage Condition</label>
                      <select className="don-input" required>
                        <option value="">Select storage type</option>
                        <option>Room Temperature</option>
                        <option>Refrigerated</option>
                        <option>Frozen</option>
                      </select>
                    </div>
                    <div className="don-field">
                      <label className="don-label">Chemical Stability Verified?</label>
                      <div className="don-radio-group">
                        <label className="don-radio">
                          <input type="radio" name="stab" value="yes" required /> Yes, chemically stable
                        </label>
                        <label className="don-radio">
                          <input type="radio" name="stab" value="no" /> No / Unsure
                        </label>
                      </div>
                    </div>
                    <div className="don-field">
                      <label className="don-label">Packaging Condition</label>
                      <select className="don-input" required>
                        <option value="">Select condition</option>
                        <option>Sealed / Intact</option>
                        <option>Minor damage, contents safe</option>
                        <option>Opened but resealed</option>
                      </select>
                    </div>
                    <div className="don-field">
                      <label className="don-label">Additional Notes</label>
                      <textarea
                        className="don-input don-textarea"
                        rows={3}
                        placeholder="Any handling instructions, allergen info, or special notes..." />
                    </div>
                    <div className="don-btn-row">
                      <button type="button" className="don-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                      <button type="submit" className="don-btn-primary" style={{ flex: 1 }}>
                        Continue: Pickup Info <ArrowRight />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <form className="don-step-form" onSubmit={e => { e.preventDefault(); setStep(4); }}>
                    <h3 className="don-step-heading">Pickup Information</h3>
                    <div className="don-field">
                      <label className="don-label">Donor / Organisation Name</label>
                      <input
                        className="don-input"
                        placeholder="Your name or company"
                        value={donorForm.name}
                        onChange={e => setDonorForm({ ...donorForm, name: e.target.value })}
                        required />
                    </div>
                    <div className="don-row-halves">
                      <div className="don-field">
                        <label className="don-label">Email Address</label>
                        <input
                          className="don-input"
                          type="email"
                          placeholder="you@email.com"
                          value={donorForm.email}
                          onChange={e => setDonorForm({ ...donorForm, email: e.target.value })}
                          required />
                      </div>
                      <div className="don-field">
                        <label className="don-label">Phone Number</label>
                        <input
                          className="don-input"
                          placeholder="+91 XXXXX XXXXX"
                          value={donorForm.phone}
                          onChange={e => setDonorForm({ ...donorForm, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="don-field">
                      <label className="don-label">Pickup Address</label>
                      <textarea
                        className="don-input don-textarea"
                        rows={2}
                        placeholder="Full street address with landmark"
                        value={pickupForm.address}
                        onChange={e => setPickupForm({ ...pickupForm, address: e.target.value })}
                        required />
                    </div>
                    <div className="don-row-halves">
                      <div className="don-field">
                        <label className="don-label">Preferred Pickup Date</label>
                        <input
                          className="don-input"
                          type="date"
                          value={pickupForm.date}
                          onChange={e => setPickupForm({ ...pickupForm, date: e.target.value })}
                          required />
                      </div>
                      <div className="don-field">
                        <label className="don-label">Time Window</label>
                        <select
                          className="don-input"
                          value={pickupForm.time}
                          onChange={e => setPickupForm({ ...pickupForm, time: e.target.value })}>
                          <option>9:00 AM – 12:00 PM</option>
                          <option>12:00 PM – 3:00 PM</option>
                          <option>3:00 PM – 6:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <div className="don-btn-row">
                      <button type="button" className="don-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                      <button type="submit" className="don-btn-primary" style={{ flex: 1 }}>
                        Review & Submit <ArrowRight />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <form className="don-step-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                    <h3 className="don-step-heading">Review & Submit</h3>
                    <div className="don-review-grid">
                      {[
                        ["Product", foodForm.productName || "—"],
                        ["Category", selectedCategory || "—"],
                        ["Quantity", foodForm.quantity ? `${foodForm.quantity} ${foodForm.unit}` : "—"],
                        ["Expiry Date", foodForm.expiryDate || "—"],
                        ["Mfg. Date", foodForm.mfgDate || "—"],
                        ["Donor", donorForm.name || "—"],
                        ["Email", donorForm.email || "—"],
                        ["Pickup Date", pickupForm.date || "—"],
                        ["Time Window", pickupForm.time],
                      ].map(([k, v]) => (
                        <div key={k} className="don-review-row">
                          <span className="don-review-key">{k}</span>
                          <strong className="don-review-val">{v}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="don-form-note">
                      <span className="don-note-dot" />
                      Once submitted, your lot will be verified and assigned to a licensed shelter partner. You'll receive a QR-tracked confirmation via email.
                    </div>
                    <div className="don-btn-row">
                      <button type="button" className="don-btn-ghost" onClick={() => setStep(3)}>← Back</button>
                      <button type="submit" className="don-btn-primary" style={{ flex: 1 }}>
                        <BoxIcon /> Submit Donation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── MONEY DONATION ─── */}
        {donationType === "money" && (
          <div className="don-money-outer">
            <div className="don-money-left">
              <span className="don-section-label">Make an Impact</span>
              <h2 className="don-form-title">Fund shelter operations directly</h2>
              <p className="don-form-sub">
                Your monetary donation covers transport costs, shelter operations, veterinary care, and ensures animals receive consistent, high-quality nutrition.
              </p>
              <div className="don-trust-badges">
                {["🔒 Secure & encrypted", "📋 SDG 12 compliant", "📦 QR-tracked lots", "🏥 Licensed partners", "📧 Digital receipts"].map((b, i) => (
                  <span key={i} className="don-trust-badge">{b}</span>
                ))}
              </div>
              <div className="don-progress-wrap">
                <div className="don-progress-top">
                  <span>Monthly Goal Progress</span>
                  <span className="don-pct">68% reached</span>
                </div>
                <div className="don-progress-bar">
                  <div className="don-progress-fill" style={{ width: "68%" }} />
                </div>
                <div className="don-progress-nums">
                  <span><strong>₹34,000</strong> raised</span>
                  <span>Goal: <strong>₹50,000</strong></span>
                </div>
              </div>
            </div>

            <div className="don-money-right">
              {submitted ? (
                <div className="don-success">
                  <div className="don-success-icon">🎉</div>
                  <h3>Thank you for donating!</h3>
                  <p>Your ₹{finalAmount?.toLocaleString()} contribution will fund shelter operations and feed animals in need.</p>
                  <button
                    className="don-btn-primary"
                    style={{ width: "auto", padding: "12px 32px" }}
                    onClick={() => setSubmitted(false)}>
                    Donate Again
                  </button>
                </div>
              ) : (
                <form className="don-money-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                  <label className="don-label">Select Amount (₹)</label>
                  <div className="don-amounts">
                    {AMOUNTS.map(a => (
                      <button
                        key={a}
                        type="button"
                        className={`don-amount-btn ${selectedAmount === a && !customAmount ? "active" : ""}`}
                        onClick={() => { setSelectedAmount(a); setCustomAmount(""); }}>
                        ₹{a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    className="don-input"
                    type="number"
                    placeholder="Or enter a custom amount (₹)"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
                  {finalAmount > 0 && (
                    <div className="don-impact-hint">
                      <ShieldIcon /> {getImpactText(finalAmount)}
                    </div>
                  )}
                  <div className="don-row-halves">
                    <div className="don-field">
                      <label className="don-label">Your Name</label>
                      <input
                        className="don-input"
                        placeholder="Full name"
                        value={donorForm.name}
                        onChange={e => setDonorForm({ ...donorForm, name: e.target.value })}
                        required />
                    </div>
                    <div className="don-field">
                      <label className="don-label">Email</label>
                      <input
                        className="don-input"
                        type="email"
                        placeholder="you@email.com"
                        value={donorForm.email}
                        onChange={e => setDonorForm({ ...donorForm, email: e.target.value })}
                        required />
                    </div>
                  </div>
                  <div className="don-field">
                    <label className="don-label">Phone (optional)</label>
                    <input
                      className="don-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={donorForm.phone}
                      onChange={e => setDonorForm({ ...donorForm, phone: e.target.value })} />
                  </div>
                  <button type="submit" className="don-btn-primary don-btn-full">
                    <HeartIcon /> Donate ₹{(finalAmount || 0).toLocaleString()}
                  </button>
                </form>
              )}
            </div>

            {/* Contact cards */}
            <div className="don-contact-row">
              {[
                {
                  icon: <MailIcon />,
                  title: "Email our team",
                  desc: "For large donations, corporate CSR enquiries, or custom arrangements.",
                  link: "mailto:donate@secondlifefoods.org",
                  label: "donate@secondlifefoods.org"
                },
                {
                  icon: <PhoneIcon />,
                  title: "Call us directly",
                  desc: "Speak to a coordinator Mon – Sat, 9 AM to 6 PM.",
                  link: "tel:+911234567890",
                  label: "+91 (123) 456-7890"
                },
                {
                  icon: <WhatsAppIcon />,
                  title: "WhatsApp chat",
                  desc: "Quick queries, lot updates, and donation receipts via chat.",
                  link: "https://wa.me/911234567890",
                  label: "Start a chat →"
                },
              ].map((c, i) => (
                <div key={i} className="don-contact-card">
                  <div className="don-contact-icon-wrap">{c.icon}</div>
                  <h4 className="don-contact-title">{c.title}</h4>
                  <p className="don-contact-desc">{c.desc}</p>
                  <a
                    href={c.link}
                    target={c.link.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="don-contact-link">
                    {c.label} <ArrowRight />
                  </a>
                </div>
              ))}
            </div>

          </div>
        )}
      </section>

      {/* ══ WALLET POINTS SECTION ══ */}
      <section className="don-wallet-section">
        <div className="don-wallet-inner">
          <div className="don-wallet-left">
            <span className="don-section-label">WalletPoints Program</span>
            <h2 className="don-wallet-title">
              Earn points for every donation,<br />
              <span>spend them on animal food.</span>
            </h2>
            <p className="don-wallet-desc">
              Every food lot or monetary donation earns you WalletPoints. Redeem them to directly
              purchase food supplies for shelters — turning your generosity into a cycle of care.
            </p>
            <div className="don-wallet-steps">
              {[
                { n: "1", title: "Donate Food or Money", desc: "Every kg of food or ₹100 donated earns you 10 WalletPoints automatically." },
                { n: "2", title: "Points Accumulate Instantly", desc: "Track your balance in real-time via your donor dashboard or QR receipt." },
                { n: "3", title: "Redeem for Animal Food", desc: "Use WalletPoints to sponsor specific food parcels for dogs, cats, or birds." },
              ].map(s => (
                <div key={s.n} className="don-wallet-step">
                  <div className="don-wallet-step-num">{s.n}</div>
                  <div className="don-wallet-step-text">
                    <span className="don-wallet-step-title">{s.title}</span>
                    <span className="don-wallet-step-desc">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="don-wallet-right">
            {/* Wallet Card */}
            <div className="don-wallet-card">
              <div className="don-wallet-card-label">Your WalletPoints Balance</div>
              <div className="don-wallet-balance">1,240 <span>pts</span></div>
              <div className="don-wallet-card-sub">≈ 12.4 kg of shelter food redeemable</div>
              <div className="don-wallet-card-divider" />
              {[
                ["Total Donated", "₹3,800 across 4 lots"],
                ["Points Earned", "380 pts this month"],
                ["Animals Helped", "~62 meals delivered"],
                ["Member Since", "Jan 2024"],
              ].map(([k, v]) => (
                <div key={k} className="don-wallet-card-row">
                  <span className="don-wallet-card-key">{k}</span>
                  <span className="don-wallet-card-val">{v}</span>
                </div>
              ))}
              <button className="don-wallet-redeem-btn">
                🐾 Redeem Points for Animal Food
              </button>
            </div>

            {/* Perks grid */}
            <div className="don-wallet-perks">
              {[
                { icon: "🐕", title: "Dog Food Parcels", desc: "10 pts = 1 kg dry kibble" },
                { icon: "🐈", title: "Cat Food Tins", desc: "8 pts = 1 tin canned food" },
                { icon: "🦜", title: "Bird Seed Mix", desc: "5 pts = 500g seed mix" },
                { icon: "🏅", title: "Donor Badge", desc: "500 pts = Gold donor status" },
              ].map((p, i) => (
                <div key={i} className="don-wallet-perk">
                  <span className="don-wallet-perk-icon">{p.icon}</span>
                  <div className="don-wallet-perk-text">
                    <span className="don-wallet-perk-title">{p.title}</span>
                    <span className="don-wallet-perk-desc">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

   
     

      {/* ══ FOOTER ══ */}
      <footer className="don-footer">
        <div className="don-footer-main">
          <div className="don-footer-brand">
            <div className="don-footer-logo">
              <LogoIcon />
              <span className="don-footer-logo-text">SecondLife <span>Foods</span></span>
            </div>
            <p className="don-footer-tagline">
              Transforming expired packaged goods into resources that reduce food waste and nourish animals across India.
            </p>
            <div className="don-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="don-social-btn"><FacebookIcon /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="don-social-btn"><TwitterIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="don-social-btn"><LinkedInIcon /></a>
            </div>
          </div>

          <div className="don-footer-col">
            <h4 className="don-footer-col-title">Contact</h4>
            <ul className="don-footer-contact">
              <li><MailIcon /><a href="mailto:contact@secondlifefoods.org">contact@secondlifefoods.org</a></li>
              <li><PhoneIcon /><a href="tel:+11234567890">+1 (123) 456-7890</a></li>
              <li><PinIcon /><span>123 Green St.<br />Cityname, ST 12345</span></li>
            </ul>
          </div>

          <div className="don-footer-col">
            <h4 className="don-footer-col-title">Quick Links</h4>
            <ul className="don-footer-links">
              <li><a href="/home">Home</a></li>
              <li><a href="/create-lot">Donate Food Lot</a></li>
              <li><a href="/create">Create Lot</a></li>
              <li><a href="/track">Track Lot</a></li>
            </ul>
          </div>

          <div className="don-footer-col">
            <h4 className="don-footer-col-title">Resources</h4>
            <ul className="don-footer-links">
              <li><a href="/knowledge">Knowledge Pocket</a></li>
              <li><a href="/qr-scanner">QR Scanner</a></li>
              <li><a href="/admin">Admin Panel</a></li>
              <li><a href="/testing">Testing Screen</a></li>
            </ul>
          </div>

          <div className="don-footer-col">
            <h4 className="don-footer-col-title">Newsletter</h4>
            <p className="don-footer-news-desc">Get monthly impact reports and donation updates.</p>
            <form
              className="don-footer-news-form"
              onSubmit={e => { e.preventDefault(); setNewsEmail(""); }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={newsEmail}
                onChange={e => setNewsEmail(e.target.value)}
                required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="don-footer-bottom">
          <p>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</p>
          <div className="don-footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}