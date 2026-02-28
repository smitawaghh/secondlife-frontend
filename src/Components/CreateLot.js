import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./CreateLot.css";

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Home",             path: "/home"      },
  { label: "Donor Dashboard",  path: "/dash"      },
  { label: "Create Lot",       path: "/create"    },
  { label: "Knowledge Pocket", path: "/knowledge" },
  { label: "QR Scanner",       path: "/qr"        },
  { label: "Admin Panel",      path: "/admin"     },
  { label: "Testing Screen",   path: "/testing"   },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`sl-nav ${scrolled ? "sl-nav--scrolled" : ""}`}>
      <div className="sl-nav__inner">
        <NavLink to="/home" className="sl-nav__logo">
          <div className="sl-nav__logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1a5c3a"/>
              <path d="M16 6C16 6 8 13.5 8 19a8 8 0 0016 0C24 13.5 16 6 16 6z" fill="white" opacity="0.9"/>
              <path d="M16 12C16 12 12 16.5 12 19a4 4 0 008 0C20 16.5 16 12 16 12z" fill="#5ecea0"/>
            </svg>
          </div>
          <span>SecondLife <strong>Foods</strong></span>
        </NavLink>

        <nav className="sl-nav__links">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.path} to={l.path}
              className={({ isActive }) => `sl-nav__link${isActive ? " sl-nav__link--active" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button className={`sl-nav__hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      <div className={`sl-nav__drawer${menuOpen ? " sl-nav__drawer--open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <NavLink key={l.path} to={l.path}
            className={({ isActive }) => `sl-nav__drawer-link${isActive ? " sl-nav__drawer-link--active" : ""}`}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════
   PHONE MOCKUP — shows lot creation steps
══════════════════════════════════════════ */
function PhoneMockup({ step }) {
  const screens = [
    {
      title: "New Lot",
      content: (
        <div className="pm-screen">
          <div className="pm-screen-label">Lot ID</div>
          <div className="pm-screen-field">LOT-2026-00021</div>
          <div className="pm-screen-label">Food Type</div>
          <div className="pm-screen-field">Rice (Sealed)</div>
          <div className="pm-screen-label">Quantity</div>
          <div className="pm-screen-field">250 kg</div>
          <div className="pm-screen-label">Expiry Date</div>
          <div className="pm-screen-field">2026-06-30</div>
          <div className="pm-screen-next">Next →</div>
        </div>
      ),
    },
    {
      title: "Storage",
      content: (
        <div className="pm-screen">
          <div className="pm-screen-label">Storage Type</div>
          <div className="pm-screen-field pm-selected">🌤 Room Temperature</div>
          <div className="pm-screen-field pm-plain">❄️ Refrigerated</div>
          <div className="pm-screen-field pm-plain">🧊 Frozen</div>
          <div className="pm-screen-label mt">Notes</div>
          <div className="pm-screen-textarea">Handle with care. Keep away from moisture.</div>
          <div className="pm-screen-next">Next →</div>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div className="pm-screen">
          <div className="pm-screen-review-row"><span>Lot ID</span><b>LOT-2026-00021</b></div>
          <div className="pm-screen-review-row"><span>Food</span><b>Rice (Sealed)</b></div>
          <div className="pm-screen-review-row"><span>Qty</span><b>250 kg</b></div>
          <div className="pm-screen-review-row"><span>Expiry</span><b>2026-06-30</b></div>
          <div className="pm-screen-review-row"><span>Storage</span><b>Room Temp</b></div>
          <div className="pm-screen-submit">✅ Create Lot</div>
        </div>
      ),
    },
  ];

  const active = screens[step - 1] || screens[0];

  return (
    <div className="phone-wrap">
      {/* glow */}
      <div className="phone-glow" />

      <div className="phone-frame">
        {/* notch */}
        <div className="phone-notch">
          <div className="phone-notch-cam" />
        </div>

        {/* status bar */}
        <div className="phone-statusbar">
          <span>9:41</span>
          <div className="phone-statusbar-icons">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
              <rect x="0" y="4" width="2" height="6" rx="1" opacity="0.4"/>
              <rect x="3" y="3" width="2" height="7" rx="1" opacity="0.6"/>
              <rect x="6" y="1" width="2" height="9" rx="1" opacity="0.8"/>
              <rect x="9" y="0" width="2" height="10" rx="1"/>
            </svg>
            <svg width="14" height="10" viewBox="0 0 20 14" fill="currentColor">
              <path d="M10 2.5C13.5 2.5 16.6 4 18.8 6.4L20 5.1C17.5 2.3 13.9 0.5 10 0.5C6.1 0.5 2.5 2.3 0 5.1L1.2 6.4C3.4 4 6.5 2.5 10 2.5Z" opacity="0.4"/>
              <path d="M10 6C12.4 6 14.6 7 16.2 8.6L17.4 7.3C15.5 5.4 12.9 4.2 10 4.2C7.1 4.2 4.5 5.4 2.6 7.3L3.8 8.6C5.4 7 7.6 6 10 6Z" opacity="0.7"/>
              <circle cx="10" cy="12" r="2"/>
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
              <rect x="0" y="1" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
              <rect x="1.5" y="2.5" width="13" height="6" rx="1.2"/>
              <rect x="19" y="3.5" width="2" height="4" rx="1" opacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* app header */}
        <div className="phone-appbar">
          <div className="phone-appbar-logo">⬡</div>
          <div className="phone-appbar-title">SecondLife Foods</div>
        </div>

        {/* progress pills */}
        <div className="phone-progress">
          {[1,2,3].map(n => (
            <div key={n} className={`phone-pill ${step === n ? "active" : ""} ${step > n ? "done" : ""}`} />
          ))}
        </div>
        <div className="phone-step-label">
          {step === 1 && "Step 1 — Basic Info"}
          {step === 2 && "Step 2 — Storage"}
          {step === 3 && "Step 3 — Review"}
        </div>

        {/* screen content */}
        <div className="phone-content">
          <div className="phone-screen-title">{active.title}</div>
          {active.content}
        </div>

        {/* home bar */}
        <div className="phone-homebar" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  const [email, setEmail] = useState("");
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { alert(`Subscribed: ${email}`); setEmail(""); }
  };

  return (
    <footer className="sl-footer">
      <div className="sl-footer__inner">
        <div className="sl-footer__brand">
          <div className="sl-footer__logo">
            <div className="sl-footer__logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.15)"/>
                <path d="M16 6C16 6 8 13.5 8 19a8 8 0 0016 0C24 13.5 16 6 16 6z" fill="white" opacity="0.9"/>
                <path d="M16 12C16 12 12 16.5 12 19a4 4 0 008 0C20 16.5 16 12 16 12z" fill="#5ecea0"/>
              </svg>
            </div>
            <span>SecondLife <strong>Foods</strong></span>
          </div>
          <p className="sl-footer__tagline">
            Transforming expired, packaged goods into valuable resources to reduce food waste and nourish animals.
          </p>
          <div className="sl-footer__socials">
            {[
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>,
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>,
              <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></>,
            ].map((d, i) => (
              <a key={i} href="#!" className="sl-footer__social">
                <svg viewBox="0 0 24 24" fill="currentColor">{d}</svg>
              </a>
            ))}
          </div>
        </div>

        <div className="sl-footer__col">
          <div className="sl-footer__col-title">CONTACT</div>
          <div className="sl-footer__contact-list">
            <a href="mailto:contact@secondlifefoods.org" className="sl-footer__contact-item">
              <span className="sl-footer__contact-icon">✉</span> contact@secondlifefoods.org
            </a>
            <a href="tel:+11234567890" className="sl-footer__contact-item">
              <span className="sl-footer__contact-icon">📞</span> +1 (123) 456-7890
            </a>
            <div className="sl-footer__contact-item">
              <span className="sl-footer__contact-icon">📍</span>
              <span>123 Green St.<br/>Cityname, ST 12345</span>
            </div>
          </div>
        </div>

        <div className="sl-footer__col">
          <div className="sl-footer__col-title">QUICK LINKS</div>
          <div className="sl-footer__link-list">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/dash">Donate Food Lot</NavLink>
            <NavLink to="/create">Create Lot</NavLink>
            <NavLink to="/track">Track Lot</NavLink>
          </div>
        </div>

        <div className="sl-footer__col">
          <div className="sl-footer__col-title">RESOURCES</div>
          <div className="sl-footer__link-list">
            <NavLink to="/knowledge">Knowledge Pocket</NavLink>
            <NavLink to="/qr">QR Scanner</NavLink>
            <NavLink to="/admin">Admin Panel</NavLink>
            <NavLink to="/testing">Testing Screen</NavLink>
          </div>
        </div>

        <div className="sl-footer__col">
          <div className="sl-footer__col-title">NEWSLETTER</div>
          <p className="sl-footer__newsletter-sub">Subscribe to our newsletter</p>
          <form className="sl-footer__newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sl-footer__newsletter-input" required />
            <button type="submit" className="sl-footer__newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="sl-footer__bottom">
        <div className="sl-footer__bottom-inner">
          <span>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</span>
          <div className="sl-footer__bottom-links">
            <a href="#!">Privacy Policy</a>
            <span className="sl-footer__bottom-sep">|</span>
            <a href="#!">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   CREATE LOT — MAIN
══════════════════════════════════════════ */
const STEPS = [
  { num: 1, title: "Basic Info",  sub: "Lot identification"  },
  { num: 2, title: "Storage",     sub: "Handling conditions" },
  { num: 3, title: "Review",      sub: "Confirm details"     },
];

export default function CreateLot() {
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData,  setFormData]  = useState({
    lotId: "", foodType: "", quantity: "", expiryDate: "", storage: "", notes: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep     = () => { if (step < 3) setStep(s => s + 1); };
  const prevStep     = () => { if (step > 1) setStep(s => s - 1); };
  const handleSubmit = () => { setSubmitted(true); console.log(formData); };
  const handleReset  = () => { setSubmitted(false); setStep(1); setFormData({ lotId:"",foodType:"",quantity:"",expiryDate:"",storage:"",notes:"" }); };

  return (
    <div className="cl-page">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="cl-hero">
        <div className="cl-hero__bg">
          <div className="cl-hero__blob b1" />
          <div className="cl-hero__blob b2" />
          <div className="cl-hero__grid" />
        </div>

        <div className="cl-hero__inner">
          {/* LEFT — text */}
          <div className="cl-hero__left">
            <div className="cl-hero__tag">
              <span className="cl-hero__dot" />
              LOT MANAGEMENT SYSTEM
            </div>

            <h1 className="cl-hero__h1">
              Create &amp; Register<br />
              <span className="cl-hero__accent">a New Food Lot</span>
            </h1>

            <p className="cl-hero__p">
              Register a new food batch into the SecondLife Foods system. Every lot you
              create is assigned a unique ID, tracked through our supply chain, and screened
              for chemical stability before being redirected to licensed feed processors or
              animal shelters — minimising waste and maximising impact.
            </p>

            <button className="cl-hero__btn" onClick={nextStep}>Create New Lot</button>
          </div>

          {/* RIGHT — phone */}
          <div className="cl-hero__right">
            <PhoneMockup step={step} />
          </div>
        </div>
      </section>

      {/* ══ FORM ══ */}
      <section className="cl-form-section">
        <div className="cl-container">

          {submitted ? (
            <div className="cl-success">
              <div className="cl-success__icon">✅</div>
              <h2 className="cl-success__h2">Lot Created Successfully!</h2>
              <p className="cl-success__p">
                <strong>Lot ID: {formData.lotId}</strong> has been registered. It will now be
                queued for chemical stability screening and QR code generation.
              </p>
              <div className="cl-success__summary">
                {[["Lot ID",formData.lotId],["Food Type",formData.foodType],
                  ["Quantity",`${formData.quantity} kg`],["Expiry Date",formData.expiryDate],
                  ["Storage",formData.storage],["Notes",formData.notes||"—"]].map(([k,v])=>(
                  <div className="cl-success__kv" key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <button className="cl-btn cl-btn--primary" onClick={handleReset}>+ Create Another Lot</button>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div className="cl-stepper">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div className={`cl-step${step===s.num?" cl-step--active":""}${step>s.num?" cl-step--done":""}`}>
                      <div className="cl-step__num">{step > s.num ? "✓" : s.num}</div>
                      <div className="cl-step__info">
                        <div className="cl-step__title">{s.title}</div>
                        <div className="cl-step__sub">{s.sub}</div>
                      </div>
                    </div>
                    {i < STEPS.length-1 && (
                      <div className={`cl-step__line${step>s.num?" cl-step__line--done":""}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Card */}
              <div className="cl-card">
                <div className="cl-card__head">
                  <div className="cl-card__step-badge">Step {step} of 3</div>
                  <h2 className="cl-card__h2">
                    {step===1&&"Lot & Product Identification"}
                    {step===2&&"Storage & Handling Conditions"}
                    {step===3&&"Review & Confirm Details"}
                  </h2>
                  <p className="cl-card__sub">
                    {step===1&&"Enter the lot ID, food type, quantity and expiry date to register this batch."}
                    {step===2&&"Specify how this lot should be stored and add any handling instructions."}
                    {step===3&&"Review all information before submitting. This will create an official lot record."}
                  </p>
                </div>

                <div className="cl-card__body">
                  {step===1 && (
                    <div className="cl-grid2">
                      <CField label="Lot ID"        name="lotId"      value={formData.lotId}      onChange={handleChange} placeholder="e.g. LOT-2026-00021"    icon="🆔"/>
                      <CField label="Food Type"     name="foodType"   value={formData.foodType}   onChange={handleChange} placeholder="e.g. Rice, Canned Beans" icon="🥫"/>
                      <CField label="Quantity (kg)" name="quantity"   value={formData.quantity}   onChange={handleChange} placeholder="Enter weight in kg" type="number" icon="⚖️"/>
                      <CField label="Expiry Date"   name="expiryDate" value={formData.expiryDate} onChange={handleChange} type="date" icon="📅"/>
                    </div>
                  )}
                  {step===2 && (
                    <div className="cl-stack">
                      <CSelect label="Storage Condition" name="storage" value={formData.storage} onChange={handleChange} icon="🌡️"
                        options={[
                          {value:"",                label:"Select storage type"},
                          {value:"Room Temperature",label:"🌤 Room Temperature (15–30°C)"},
                          {value:"Refrigerated",    label:"❄️ Refrigerated (2–8°C)"},
                          {value:"Frozen",          label:"🧊 Frozen (below 0°C)"},
                        ]}/>
                      <CTextarea label="Additional Notes" name="notes" value={formData.notes} onChange={handleChange} icon="📝"
                        placeholder="Add handling instructions, special remarks, or donor info..."/>
                    </div>
                  )}
                  {step===3 && (
                    <div className="cl-review">
                      <div className="cl-review__section-title">📦 Lot Details</div>
                      <div className="cl-review__grid">
                        <CKV k="Lot ID"      v={formData.lotId||"—"}/>
                        <CKV k="Food Type"   v={formData.foodType||"—"}/>
                        <CKV k="Quantity"    v={formData.quantity?`${formData.quantity} kg`:"—"}/>
                        <CKV k="Expiry Date" v={formData.expiryDate||"—"}/>
                      </div>
                      <div className="cl-review__divider"/>
                      <div className="cl-review__section-title">🌡️ Storage &amp; Notes</div>
                      <div className="cl-review__grid">
                        <CKV k="Storage Condition" v={formData.storage||"—"}/>
                        <CKV k="Notes"             v={formData.notes||"—"} fullWidth/>
                      </div>
                      <div className="cl-review__notice">
                        <span>⚠️</span>
                        Once submitted, this lot will be officially registered and queued for lab screening.
                        Make sure all details are accurate.
                      </div>
                    </div>
                  )}
                </div>

                <div className="cl-card__footer">
                  <div>
                    {step>1&&<button className="cl-btn cl-btn--ghost" onClick={prevStep}>← Back</button>}
                  </div>
                  <div className="cl-card__footer-right">
                    <div className="cl-progress-dots">
                      {STEPS.map(s=>(
                        <div key={s.num} className={`cl-dot${step===s.num?" cl-dot--active":""}${step>s.num?" cl-dot--done":""}`}/>
                      ))}
                    </div>
                    {step<3&&<button className="cl-btn cl-btn--primary" onClick={nextStep}>Next →</button>}
                    {step===3&&<button className="cl-btn cl-btn--primary cl-btn--submit" onClick={handleSubmit}>✅ Create Lot</button>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── field helpers ── */
function CField({label,name,value,onChange,placeholder,type="text",icon}){
  return(
    <label className="cl-field">
      <span className="cl-field__label"><span className="cl-field__icon">{icon}</span>{label}</span>
      <input className="cl-field__input" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}/>
    </label>
  );
}
function CSelect({label,name,value,onChange,options,icon}){
  return(
    <label className="cl-field">
      <span className="cl-field__label"><span className="cl-field__icon">{icon}</span>{label}</span>
      <select className="cl-field__input cl-field__select" name={name} value={value} onChange={onChange}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function CTextarea({label,name,value,onChange,placeholder,icon}){
  return(
    <label className="cl-field">
      <span className="cl-field__label"><span className="cl-field__icon">{icon}</span>{label}</span>
      <textarea className="cl-field__input cl-field__textarea" name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}/>
    </label>
  );
}
function CKV({k,v,fullWidth}){
  return(
    <div className={`cl-kv${fullWidth?" cl-kv--full":""}`}>
      <span className="cl-kv__k">{k}</span>
      <strong className="cl-kv__v">{v}</strong>
    </div>
  );
}