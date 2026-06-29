import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLot } from "../api/storage.js";
import { createQrString } from "../api/qr.js";
import { getUser } from "../auth/auth.js";
import PageHeader from "../components/PageHeader.jsx";

const CATEGORIES = ["Perishable", "Semi-perishable", "Frozen"];
const ROUTES = ["Human redistribution", "Animal feed"];

export default function CreateLot() {
  const navigate = useNavigate();
  const user = getUser();

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    foodName: "",
    category: "Perishable",
    qtyKg: "",
    expiryDate: "",
    donorName: user?.name || "",
    route: "Human redistribution",
    pickup: {
      line1: "",
      city: "",
      state: "",
      pincode: "",
      date: "",
      start: "09:00",
      end: "17:00",
    },
  });

  function set(key, val) {
    setErr("");
    setForm((f) => ({ ...f, [key]: val }));
  }

  function setPickup(key, val) {
    setErr("");
    setForm((f) => ({ ...f, pickup: { ...f.pickup, [key]: val } }));
  }

  function validate0() {
    if (!form.foodName.trim()) return "Food name is required.";
    if (!form.qtyKg || Number(form.qtyKg) <= 0) return "Quantity must be greater than 0.";
    if (!form.expiryDate) return "Expiry date is required.";
    return null;
  }

  function validate1() {
    if (!form.pickup.line1.trim()) return "Address line 1 is required.";
    if (!form.pickup.city.trim()) return "City is required.";
    if (!form.pickup.date) return "Pickup date is required.";
    return null;
  }

  function next() {
    const e = step === 0 ? validate0() : validate1();
    if (e) return setErr(e);
    setStep((s) => s + 1);
  }

  async function handleCreate() {
    setBusy(true);
    setErr("");
    try {
      const id = Date.now();
      const now = new Date().toISOString();
      const qr = await createQrString(id);

      addLot({
        id,
        foodName: form.foodName.trim(),
        category: form.category,
        qtyKg: Number(form.qtyKg),
        quantityKg: Number(form.qtyKg),
        expiryDate: form.expiryDate,
        donorName: form.donorName.trim() || user?.name || "Donor",
        route: form.route,
        pickup: { ...form.pickup },
        status: "CREATED",
        qr,
        createdAt: now,
        updatedAt: now,
        custody: [{
          type: "CREATED",
          event: "CREATED",
          at: now,
          by: user?.name || "Donor",
          note: "Lot created with QR.",
        }],
      });

      navigate(`/lots/${id}`);
    } catch (e) {
      setErr(e?.message || "Failed to create lot. Try again.");
      setBusy(false);
    }
  }

  const pickupAddr = [form.pickup.line1, form.pickup.city, form.pickup.state, form.pickup.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Food Donation"
        title="Create New Lot"
        subtitle="Register surplus food with full QR traceability. Three simple steps."
      />

      {/* Stepper */}
      <div className="card">
        <div className="stepper">
          <div className={`step${step === 0 ? " active" : ""}`}>
            <div className="step-num">1</div>
            <div>
              <div className="step-title">Food details</div>
              <div className="step-sub">What are you donating?</div>
            </div>
          </div>
          <div className="step-line" />
          <div className={`step${step === 1 ? " active" : ""}`}>
            <div className="step-num">2</div>
            <div>
              <div className="step-title">Route & Pickup</div>
              <div className="step-sub">How and where?</div>
            </div>
          </div>
          <div className="step-line" />
          <div className={`step${step === 2 ? " active" : ""}`}>
            <div className="step-num">3</div>
            <div>
              <div className="step-title">Review</div>
              <div className="step-sub">Confirm and create</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 — Food details */}
      {step === 0 && (
        <div className="card form">
          <div className="card-header">
            <div>
              <h2 className="card-title">Food details</h2>
              <p className="card-subtitle">Describe the food lot being donated.</p>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="field">
              <label>Food name *</label>
              <input
                value={form.foodName}
                onChange={(e) => set("foodName", e.target.value)}
                placeholder="e.g. Brown rice, Bananas"
              />
            </div>
            <div className="field">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Quantity (kg) *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.qtyKg}
                onChange={(e) => set("qtyKg", e.target.value)}
                placeholder="e.g. 25"
              />
            </div>
            <div className="field">
              <label>Expiry date *</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Donor name</label>
              <input
                value={form.donorName}
                onChange={(e) => set("donorName", e.target.value)}
                placeholder="Your name or organisation"
              />
            </div>
            <div className="field">
              <label>Redistribution route</label>
              <select value={form.route} onChange={(e) => set("route", e.target.value)}>
                {ROUTES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {err && <div className="error" style={{ marginTop: 12 }}>{err}</div>}

          <div className="wizard-footer">
            <div className="left">
              <button className="btn ghost" type="button" onClick={() => navigate("/")}>Cancel</button>
            </div>
            <div className="right">
              <button className="btn primary" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Route & Pickup */}
      {step === 1 && (
        <div className="card form">
          <div className="card-header">
            <div>
              <h2 className="card-title">Route & Pickup</h2>
              <p className="card-subtitle">Where should this lot be collected from?</p>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label>Address line 1 *</label>
              <input
                value={form.pickup.line1}
                onChange={(e) => setPickup("line1", e.target.value)}
                placeholder="e.g. 12 Green Street, Warehouse B"
              />
            </div>
            <div className="field">
              <label>City *</label>
              <input
                value={form.pickup.city}
                onChange={(e) => setPickup("city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="field">
              <label>State</label>
              <input
                value={form.pickup.state}
                onChange={(e) => setPickup("state", e.target.value)}
                placeholder="State / Province"
              />
            </div>
            <div className="field">
              <label>Pincode</label>
              <input
                value={form.pickup.pincode}
                onChange={(e) => setPickup("pincode", e.target.value)}
                placeholder="Postal code"
              />
            </div>
            <div className="field">
              <label>Pickup date *</label>
              <input
                type="date"
                value={form.pickup.date}
                onChange={(e) => setPickup("date", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Window start</label>
              <input
                type="time"
                value={form.pickup.start}
                onChange={(e) => setPickup("start", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Window end</label>
              <input
                type="time"
                value={form.pickup.end}
                onChange={(e) => setPickup("end", e.target.value)}
              />
            </div>
          </div>

          {err && <div className="error" style={{ marginTop: 12 }}>{err}</div>}

          <div className="wizard-footer">
            <div className="left">
              <button className="btn ghost" type="button" onClick={() => setStep(0)}>← Back</button>
            </div>
            <div className="right">
              <button className="btn primary" type="button" onClick={next}>Review →</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 2 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Review & Create</h2>
              <p className="card-subtitle">Confirm details — a QR code is generated on creation.</p>
            </div>
          </div>

          <div className="kv">
            <div><span>Food</span><b>{form.foodName}</b></div>
            <div><span>Category</span><b>{form.category}</b></div>
            <div><span>Quantity</span><b>{form.qtyKg} kg</b></div>
            <div><span>Expiry</span><b>{form.expiryDate}</b></div>
            <div><span>Route</span><b>{form.route}</b></div>
            <div><span>Donor</span><b>{form.donorName || user?.name || "-"}</b></div>
            <div><span>Pickup address</span><b>{pickupAddr || "-"}</b></div>
            <div><span>Pickup window</span><b>{form.pickup.date} • {form.pickup.start} – {form.pickup.end}</b></div>
          </div>

          {err && <div className="error" style={{ marginTop: 12 }}>{err}</div>}

          <div className="wizard-footer">
            <div className="left">
              <button className="btn ghost" type="button" onClick={() => setStep(1)}>← Back</button>
            </div>
            <div className="right">
              <button className="btn primary" type="button" onClick={handleCreate} disabled={busy}>
                {busy ? "Creating…" : "Create Lot & Generate QR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
