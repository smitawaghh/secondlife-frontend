// src/pages/Testing.js
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Testing.css";

const PRODUCT_TYPES = ["Maggi", "Rice", "Biscuits", "Bread / Bakery", "Dairy", "Other"];
const STORAGE = ["Refrigerated", "Room Temperature", "Open Exposed", "Frozen"];
const PACKAGING = ["Sealed", "Open"];

// Map nav labels to routes
const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "Donor Dashboard", path: "/dash" },
  { label: "Create Lot", path: "/create-lot" },
  { label: "Knowledge Pocket", path: "#" },
  { label: "QR Scanner", path: "/qr" },
  { label: "Admin Panel", path: "#" },
  { label: "Testing Screen", path: "/testing" },
];

const CHEM_IMG = "https://images.ctfassets.net/a36tny48the1/1olKfHj7JzxmHyfvImVES8/e4ea23d60f58f7cd98327a04dcd39d6c/Chemical_testing_services.jpg?w=1280";

const PIPELINE_STEPS = [
  { num: "01", icon: "📋", title: "Sample Registration", desc: "Each food item is logged with a unique traceable Sample ID, batch number, product type, manufacturing & expiry dates." },
  { num: "02", icon: "🔬", title: "Physical Screening", desc: "Visual & sensory inspection for mold, odor, color changes, texture deviation and moisture before chemical analysis." },
  { num: "03", icon: "⚗️", title: "Chemical Analysis", desc: "pH level, acidity %, ammonia indicator, and fat oxidation index are computed using product-specific degradation models." },
  { num: "04", icon: "📊", title: "Verdict & Routing", desc: "A weighted stability score (0–100) determines the final verdict: Stable, Moderately Risky, or Unsafe — with routing guidance." },
];

function pad2(n) { return String(n).padStart(2, "0"); }
function isoToday() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function nowISO() { return new Date().toISOString(); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function randBetween(min, max) { return min + Math.random() * (max - min); }
function daysBetween(a, b) { if (!a || !b) return 0; return Math.floor((new Date(b+"T00:00:00") - new Date(a+"T00:00:00")) / 86400000); }
function makeId(p) { return `${p}-${Math.floor(100000 + Math.random() * 900000)}`; }
function makeReqId() { return `REQ-${Math.random().toString(16).slice(2,8)}${Math.random().toString(16).slice(2,6)}`.toUpperCase(); }
function statusFromRange(v, lo, hi) { if (v < lo) return {label:"Below Range",tone:"warn"}; if (v > hi) return {label:"Above Range",tone:"danger"}; return {label:"Normal Range",tone:"ok"}; }
function safeRanges(pt) {
  if (pt==="Rice") return {ph:{low:6.0,high:7.2},acidity:{low:0,high:0.40},ammonia:{low:0,high:2.0},fatOx:{low:0,high:2.2}};
  if (pt==="Biscuits") return {ph:{low:6.0,high:7.8},acidity:{low:0,high:0.35},ammonia:{low:0,high:2.4},fatOx:{low:0,high:1.8}};
  return {ph:{low:6.0,high:7.8},acidity:{low:0,high:0.35},ammonia:{low:0,high:2.2},fatOx:{low:0,high:2.5}};
}
function weights(pt) {
  if (pt==="Rice") return {expiry:1.15,physical:1.1,chemical:1.0,microbial:1.2};
  if (pt==="Biscuits") return {expiry:0.95,physical:0.9,chemical:1.2,microbial:0.85};
  return {expiry:0.9,physical:0.95,chemical:1.05,microbial:0.9};
}
function computeMetrics({productType, daysAfterExpiry, storageCondition, packagingStatus, observations}) {
  const ed = Math.max(daysAfterExpiry, 0);
  const sealed = packagingStatus === "Sealed";
  const openExp = storageCondition === "Open Exposed";
  const roomTemp = storageCondition === "Room Temperature";
  const physPenalty =
    (observations.visibleMold==="Yes"?38:0) +
    (observations.odor==="Foul"?24:observations.odor==="Sour"?12:0) +
    (observations.colorChange==="Yes"?9:0) +
    (observations.texture==="Changed"?9:0) +
    (observations.moistureObserved==="High"?(productType==="Rice"?14:8):0);
  const baseExp = productType==="Rice"?7.5:productType==="Biscuits"?4.2:3.8;
  const expiryRisk = clamp(ed * baseExp, 0, 40);
  const storagePenalty = (openExp?10:0)+(roomTemp?5:0)+(!sealed?7:0);
  let ph = 6.8 - ed*(productType==="Rice"?0.32:0.18);
  if (observations.odor==="Sour") ph-=0.35;
  if (openExp) ph-=0.15;
  ph = clamp(ph, 2.6, 8.6);
  let acidity = 0.16 + ed*(productType==="Rice"?0.11:0.07);
  if (observations.odor==="Sour") acidity+=0.15;
  if (openExp) acidity+=0.06;
  acidity = clamp(acidity, 0, 1.8);
  let ammonia = ed*(productType==="Rice"?0.75:0.55);
  if (observations.odor==="Foul") ammonia+=1.4;
  if (!sealed) ammonia+=0.5;
  ammonia = clamp(ammonia, 0, 10);
  let fatOx = ed*(productType==="Biscuits"?0.95:0.65);
  if (roomTemp) fatOx+=0.8;
  if (!sealed) fatOx+=0.6;
  fatOx = clamp(fatOx, 0, 10);
  let microbial = 18 + expiryRisk + physPenalty + storagePenalty + ammonia*2 + acidity*8;
  if (productType==="Rice") microbial+=10;
  if (productType==="Biscuits") microbial-=6;
  if (sealed) microbial-=6;
  microbial = clamp(microbial, 0, 100);
  const ranges = safeRanges(productType);
  const dev = (val, r) => val<r.low?(r.low-val)/(r.high-r.low):val>r.high?(val-r.high)/(r.high-r.low):0;
  const chemDev = dev(ph,ranges.ph)*30 + dev(acidity,ranges.acidity)*35 + dev(ammonia,ranges.ammonia)*20 + dev(fatOx,ranges.fatOx)*25;
  const w = weights(productType);
  const stability = clamp(100-(expiryRisk*w.expiry+(physPenalty+storagePenalty)*w.physical+microbial*0.55*w.microbial+chemDev*w.chemical),0,100);
  let verdict = "Stable", route = "Controlled reuse after standard handling.";
  if (stability<80) { verdict="Moderately Risky"; route=productType==="Biscuits"?"Prefer compost/bioconversion; avoid direct consumption reuse.":"Use compost/bioconversion routes; avoid direct reuse."; }
  if (stability<55 || observations.visibleMold==="Yes") { verdict="Unsafe"; route="Do not reuse. Route to safe disposal or supervised processing."; }
  const metrics = [
    {key:"pH Level",value:ph,display:ph.toFixed(2),unit:"",range:ranges.ph},
    {key:"Acidity",value:acidity,display:acidity.toFixed(2),unit:"%",range:ranges.acidity},
    {key:"Ammonia Indicator",value:ammonia,display:ammonia.toFixed(1),unit:"",range:ranges.ammonia},
    {key:"Fat Oxidation Index",value:fatOx,display:fatOx.toFixed(1),unit:"",range:ranges.fatOx},
  ].map(m => { const s=statusFromRange(m.value,m.range.low,m.range.high); return {name:m.key,value:`${m.display}${m.unit}`,safeRange:`${m.range.low} – ${m.range.high}`,status:s.label,statusTone:s.tone}; });
  return {
    scores:{stabilityScore:Math.round(stability),microbialRisk:Math.round(microbial),expiryRisk:Math.round(expiryRisk),physicalRisk:Math.round(clamp(physPenalty+storagePenalty,0,100)),chemicalDeviation:Math.round(clamp(chemDev,0,100))},
    chemicalMetrics:metrics, finalVerdict:verdict, recommendationRoute:route,
  };
}
const pp = (o) => JSON.stringify(o, null, 2);
const vtag = (v) => v==="Stable"?"tag-ok":v==="Moderately Risky"?"tag-warn":"tag-danger";
const stag = (t) => t==="ok"?"tag-ok":t==="warn"?"tag-warn":"tag-danger";

export default function Testing() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Testing Screen");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedLots, setSavedLots] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [auditLogs, setAuditLogs] = useState([
    `${nowISO()} [INFO] Service started. Version v1.3.2`,
    `${nowISO()} [INFO] Database connection established.`,
  ]);
  const [recentRuns, setRecentRuns] = useState([
    {runId:makeId("RUN"),sampleId:makeId("SLF"),productType:"Rice",processedAt:nowISO(),verdict:"Moderately Risky",stabilityScore:62,requestId:makeReqId()},
    {runId:makeId("RUN"),sampleId:makeId("SLF"),productType:"Biscuits",processedAt:nowISO(),verdict:"Stable",stabilityScore:87,requestId:makeReqId()},
  ]);
  const [sampleQueue, setSampleQueue] = useState([
    {sampleId:makeId("SLF"),productType:"Rice",batchNo:"R-2402-A1",testDate:isoToday(),status:"Queued"},
    {sampleId:makeId("SLF"),productType:"Biscuits",batchNo:"B-2402-C4",testDate:isoToday(),status:"Queued"},
  ]);
  const [form, setForm] = useState({
    sampleId:makeId("SLF"),productType:"Maggi",batchNo:"M-2402-X1",
    manufacturingDate:"",expiryDate:"",testDate:isoToday(),
    storageCondition:"Room Temperature",packagingStatus:"Sealed",
    description:"",notes:"",
  });
  const [obs, setObs] = useState({colorChange:"No",odor:"Normal",texture:"Normal",visibleMold:"No",moistureObserved:"Normal"});
  const [pipeline, setPipeline] = useState({running:false,progress:0,stage:"Idle",lastRequestId:"",lastRunId:"",results:null});
  const timerRef = useRef(null);

  const daysAfterExpiry = useMemo(() => (!form.expiryDate ? 0 : daysBetween(form.expiryDate, form.testDate)), [form.expiryDate, form.testDate]);
  const expiryTag = useMemo(() => {
    if (!form.expiryDate) return {text:"Expiry date not set",tone:"muted"};
    if (daysAfterExpiry<=0) return {text:"Within expiry window",tone:"ok"};
    if (daysAfterExpiry<=2) return {text:`Expired (${daysAfterExpiry} day)`,tone:"warn"};
    return {text:`Expired (${daysAfterExpiry} days)`,tone:"danger"};
  }, [form.expiryDate, daysAfterExpiry]);

  const log = (line) => setAuditLogs(p => [`${nowISO()} ${line}`,...p].slice(0,25));
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current=null; } };
  const ff = (k,v) => setForm(p=>({...p,[k]:v}));
  const of = (k,v) => setObs(p=>({...p,[k]:v}));

  // Handle nav click with routing
  function handleNavClick(link) {
    setActiveNav(link.label);
    setMobileOpen(false);
    if (link.path && link.path !== "#") {
      navigate(link.path);
    }
  }

  function saveLot() {
    const lot = {
      id:makeId("LOT"), savedAt:nowISO(), sampleId:form.sampleId, productType:form.productType,
      batchNo:form.batchNo||"-", storageCondition:form.storageCondition, packagingStatus:form.packagingStatus,
      expiryDate:form.expiryDate||"-", description:form.description||"-",
      verdict:pipeline.results?pipeline.results.results.finalVerdict:"Not tested",
      score:pipeline.results?pipeline.results.results.scores.stabilityScore:null,
    };
    setSavedLots(p=>[lot,...p]);
    setShowSaved(true);
    log(`[INFO] Lot saved: lotId=${lot.id} sampleId=${lot.sampleId}`);
  }

  function runTests() {
    if (pipeline.running) return;
    const reqId=makeReqId(), runId=makeId("RUN");
    setSampleQueue(q=>[{sampleId:form.sampleId,productType:form.productType,batchNo:form.batchNo||"-",testDate:form.testDate,status:"Queued"},...q].slice(0,12));
    log(`[INFO] POST /api/tests/run requestId=${reqId} sampleId=${form.sampleId}`);
    log(`[INFO] Pipeline: Physical -> Chemical -> Scoring -> Verdict`);
    setPipeline({running:true,progress:0,stage:"Stage 1: Physical screening",lastRequestId:reqId,lastRunId:runId,results:null});
    stopTimer();
    const stages=[{at:12,name:"Stage 1: Physical screening"},{at:40,name:"Stage 2: Chemical indicators"},{at:74,name:"Stage 3: Risk scoring"},{at:92,name:"Stage 4: Verdict generation"}];
    timerRef.current = setInterval(()=>{
      setPipeline(prev=>{
        const p=clamp(prev.progress+Math.floor(randBetween(4,10)),0,100);
        const s=stages.slice().reverse().find(x=>p>=x.at)?.name||prev.stage;
        return {...prev,progress:p,stage:s};
      });
    },220);
    setTimeout(()=>{
      stopTimer();
      const computed = computeMetrics({productType:form.productType,daysAfterExpiry:form.expiryDate?daysAfterExpiry:0,storageCondition:form.storageCondition,packagingStatus:form.packagingStatus,observations:obs});
      const res = {
        apiMeta:{requestId:reqId,runId,processedAt:nowISO(),version:"v1.3.2",status:"OK"},
        sample:{sampleId:form.sampleId,productType:form.productType,batchNo:form.batchNo||"-",expiryDate:form.expiryDate||null,testDate:form.testDate,daysAfterExpiry:form.expiryDate?daysAfterExpiry:null,storageCondition:form.storageCondition,packagingStatus:form.packagingStatus,observations:obs},
        results:computed,
        audit:{stages:["Physical screening completed","Chemical indicators computed","Risk scoring computed","Verdict generated"]},
      };
      setSampleQueue(q=>q.map(it=>it.sampleId===form.sampleId?{...it,status:"Processed"}:it));
      setRecentRuns(r=>[{runId,sampleId:form.sampleId,productType:form.productType,processedAt:res.apiMeta.processedAt,verdict:computed.finalVerdict,stabilityScore:computed.scores.stabilityScore,requestId:reqId},...r].slice(0,10));
      log(`[INFO] Completed: verdict=${computed.finalVerdict} stability=${computed.scores.stabilityScore}%`);
      setPipeline({running:false,progress:100,stage:"Completed",lastRequestId:reqId,lastRunId:runId,results:res});
      setActiveTab("results");
    }, 2100+Math.floor(Math.random()*600));
  }

  function downloadReport() {
    if (!pipeline.results) return;
    const blob=new Blob([pp(pipeline.results)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`${pipeline.results.sample.sampleId}_report.json`; a.click(); URL.revokeObjectURL(url);
  }

  function resetForm() {
    setForm({sampleId:makeId("SLF"),productType:form.productType,batchNo:"",manufacturingDate:"",expiryDate:"",testDate:isoToday(),storageCondition:"Room Temperature",packagingStatus:"Sealed",description:"",notes:""});
    setObs({colorChange:"No",odor:"Normal",texture:"Normal",visibleMold:"No",moistureObserved:"Normal"});
    setPipeline({running:false,progress:0,stage:"Idle",lastRequestId:"",lastRunId:"",results:null});
    log(`[INFO] New sample form initialized.`);
  }

  return (
    <div className="tPage">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navInner">
          <div className="navBrand" onClick={() => navigate("/home")} style={{cursor:"pointer"}}>
            <div className="navLogo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C9 2 5 5 5 10c0 3 1.5 5.5 3.5 7.5C10 19 12 20 12 20s2-1 3.5-2.5C17.5 15.5 19 13 19 10c0-5-4-8-7-8z" fill="white" opacity="0.95"/>
                <path d="M12 7v7M9.5 11.5L12 14l2.5-2.5" stroke="rgba(0,100,60,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="navName">SecondLife <strong>Foods</strong></span>
          </div>
          <div className="navLinks">
            {NAV_LINKS.map(link=>(
              <button
                key={link.label}
                className={`navLink ${activeNav===link.label?"navActive":""}`}
                onClick={()=>handleNavClick(link)}
              >
                {link.label}
              </button>
            ))}
          </div>
          <button className="navBurger" onClick={()=>setMobileOpen(!mobileOpen)}>
            <span/><span/><span/>
          </button>
        </div>
        {mobileOpen && (
          <div className="mobileMenu">
            {NAV_LINKS.map(link=>(
              <button
                key={link.label}
                className={`mobileLink ${activeNav===link.label?"mobileLinkActive":""}`}
                onClick={()=>handleNavClick(link)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ══ HERO SECTION 1 ══ */}
      <section className="heroSection">
        <div className="heroSectionInner">
          <div className="heroTextCol">
            <div className="heroKicker">Second Life Food Lab</div>
            <h1 className="heroH1">Chemical Stability<br/><span className="heroAccent">Testing Module</span></h1>
            <p className="heroPara">
              A multi-stage food safety pipeline designed for Maggi, Rice, and Biscuits.
              Register samples, run physical and chemical screenings, and receive
              evidence-based routing verdicts — all in real time.
            </p>
            <div className="heroStatStrip">
              <div className="heroStatItem">
                <span className="heroStatNum">4</span>
                <span className="heroStatLabel">Pipeline Stages</span>
              </div>
              <div className="heroStatDivider"/>
              <div className="heroStatItem">
                <span className="heroStatNum">6+</span>
                <span className="heroStatLabel">Product Types</span>
              </div>
              <div className="heroStatDivider"/>
              <div className="heroStatItem">
                <span className="heroStatNum">100</span>
                <span className="heroStatLabel">Point Stability Score</span>
              </div>
              <div className="heroStatDivider"/>
              <div className="heroStatItem">
                <span className="heroStatNum greenText">Live</span>
                <span className="heroStatLabel">API v1.3.2</span>
              </div>
            </div>
            <div className="heroBadgeRow">
              <span className="heroBadge heroBadgeGreen"><span className="greenDot"/>Database Connected</span>
              <span className={`heroBadge expiryPill-${expiryTag.tone}`}>{expiryTag.text}</span>
              <span className="heroBadge heroBadgeNeutral">{sampleQueue.length} samples queued</span>
            </div>
          </div>
          <div className="heroImgCol">
            <img src={CHEM_IMG} alt="Chemical Testing Laboratory" className="heroImg"/>
          </div>
        </div>
      </section>

      {/* ══ HERO SECTION 2: Pipeline Steps ══ */}
      <section className="stepsSection">
        <div className="stepsSectionInner">
          <div className="stepsTextCol">
            <div className="stepsKicker">Testing Pipeline</div>
            <h2 className="stepsH2">How the Testing<br/>Process Works</h2>
            <p className="stepsPara">
              Every food sample passes through four structured stages — from physical
              registration to chemical analysis and final routing verdict.
            </p>
            <div className="stepsListCol">
              {PIPELINE_STEPS.map(step=>(
                <div className="stepItem" key={step.num}>
                  <div className="stepBadge">{step.num}</div>
                  <div className="stepItemBody">
                    <div className="stepItemTop">
                      <span className="stepItemIcon">{step.icon}</span>
                      <span className="stepItemTitle">{step.title}</span>
                    </div>
                    <div className="stepItemDesc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="stepsImgCol">
            <div className="stepsImgWrap">
              <img
                src="https://www.bharattesthouse.com/img/Our-services/Testing/Chemical-testing.webp"
                alt="Lab Testing Process"
                className="stepsImg"
              />
              <div className="stepsImgCard">
                <div className="stepsImgCardTitle">Supported Products</div>
                {["🍜 Maggi Noodles","🍚 Cooked Rice","🍪 Biscuits","🍞 Bread / Bakery","🥛 Dairy","📦 Other"].map(p=>(
                  <div className="stepsImgCardRow" key={p}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAVED LOTS DRAWER */}
      {showSaved && (
        <div className="drawer-overlay" onClick={()=>setShowSaved(false)}>
          <div className="drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawerHead">
              <h3 className="drawerTitle">Saved Lots <span className="countBadge">{savedLots.length}</span></h3>
              <button className="drawerClose" onClick={()=>setShowSaved(false)}>✕</button>
            </div>
            {savedLots.length===0
              ? <div className="drawerEmpty">No lots saved yet.</div>
              : <div className="drawerList">
                  {savedLots.map(lot=>(
                    <div className="drawerItem" key={lot.id}>
                      <div className="drawerItemHead">
                        <span className="mono small fw">{lot.id}</span>
                        <span className={`tag ${vtag(lot.verdict)}`}>{lot.verdict}</span>
                      </div>
                      <div className="drawerItemRow"><span className="muted">Product</span><span>{lot.productType} — {lot.batchNo}</span></div>
                      <div className="drawerItemRow"><span className="muted">Storage</span><span>{lot.storageCondition} · {lot.packagingStatus}</span></div>
                      {lot.score!==null&&<div className="drawerItemRow"><span className="muted">Score</span><span className="mono fw">{lot.score}/100</span></div>}
                      <div className="drawerItemRow"><span className="muted">Saved</span><span className="mono small">{lot.savedAt.slice(0,19)}Z</span></div>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}

      <div className="container">

        {/* ── SECTION 1: INTAKE ── */}
        <section className="section">
          <div className="secHeader">
            <div className="secLeft">
              <span className="secNum">01</span>
              <div>
                <h2 className="secTitle">Sample Intake &amp; Physical Examination</h2>
                <p className="secSub">Register the food sample and conduct visual screening before chemical tests.</p>
              </div>
            </div>
            <button className="btnSave" onClick={saveLot}>💾 Save Lot</button>
          </div>

          <div className="twoCol">
            <div className="card">
              <div className="cardHead">
                <h3 className="cardTitle">Product &amp; Batch Information</h3>
                <span className="cardBadge">Step 1</span>
              </div>
              <p className="cardHint">Fields marked <span className="req">*</span> directly affect the scoring algorithm.</p>
              <div className="fGrid">
                <label className="fField"><span className="fLabel">Sample ID</span><input className="fCtrl mono" value={form.sampleId} readOnly/></label>
                <label className="fField"><span className="fLabel">Batch No <span className="req">*</span></span><input className="fCtrl mono" value={form.batchNo} onChange={e=>ff("batchNo",e.target.value)} placeholder="e.g. M-2402-X1"/></label>
                <label className="fField"><span className="fLabel">Product Type <span className="req">*</span></span><select className="fCtrl" value={form.productType} onChange={e=>ff("productType",e.target.value)}>{PRODUCT_TYPES.map(p=><option key={p}>{p}</option>)}</select></label>
                <label className="fField"><span className="fLabel">Storage Condition <span className="req">*</span></span><select className="fCtrl" value={form.storageCondition} onChange={e=>ff("storageCondition",e.target.value)}>{STORAGE.map(s=><option key={s}>{s}</option>)}</select></label>
                <label className="fField"><span className="fLabel">Packaging Status <span className="req">*</span></span><select className="fCtrl" value={form.packagingStatus} onChange={e=>ff("packagingStatus",e.target.value)}>{PACKAGING.map(p=><option key={p}>{p}</option>)}</select></label>
                <label className="fField"><span className="fLabel">Test Date</span><input className="fCtrl mono" type="date" value={form.testDate} onChange={e=>ff("testDate",e.target.value)}/></label>
                <label className="fField"><span className="fLabel">Manufacturing Date</span><input className="fCtrl mono" type="date" value={form.manufacturingDate} onChange={e=>ff("manufacturingDate",e.target.value)}/></label>
                <label className="fField"><span className="fLabel">Expiry Date <span className="req">*</span></span><input className="fCtrl mono" type="date" value={form.expiryDate} onChange={e=>ff("expiryDate",e.target.value)}/></label>
                <div className="fField">
                  <span className="fLabel">Days After Expiry</span>
                  <div className="fReadonly">
                    {form.expiryDate
                      ? <span className={daysAfterExpiry>0?"numRed":"numGreen"}>{daysAfterExpiry} day(s) — {daysAfterExpiry>0?"EXPIRED":"valid"}</span>
                      : <span className="muted">Set expiry date</span>}
                  </div>
                </div>
                <label className="fField fFull"><span className="fLabel">Sample Description</span><input className="fCtrl" value={form.description} onChange={e=>ff("description",e.target.value)} placeholder="Origin, appearance, condition on arrival..."/></label>
                <label className="fField fFull"><span className="fLabel">Handling Notes</span><textarea className="fCtrl fTextarea" value={form.notes} onChange={e=>ff("notes",e.target.value)} placeholder="Transportation conditions, special observations..."/></label>
              </div>
            </div>

            <div className="card">
              <div className="cardHead">
                <h3 className="cardTitle">Physical Examination</h3>
                <span className="cardBadge">Step 2</span>
              </div>
              <p className="cardHint">Visual &amp; sensory screening. These observations directly affect microbial risk and the final verdict.</p>
              <div className="obsGrid">
                {[
                  {key:"colorChange",label:"Color Change",options:["No","Yes"],hint:"Compare against reference color"},
                  {key:"odor",label:"Odor Profile",options:["Normal","Sour","Foul"],hint:"Sour = mild spoilage · Foul = advanced decay"},
                  {key:"texture",label:"Texture",options:["Normal","Changed"],hint:"Softening, clumping, sliminess"},
                  {key:"visibleMold",label:"Visible Mold",options:["No","Yes"],hint:"Mold → auto-triggers Unsafe verdict"},
                  {key:"moistureObserved",label:"Moisture Level",options:["Normal","High"],hint:"High moisture raises microbial risk"},
                ].map(({key,label,options,hint})=>(
                  <div className="obsCard" key={key}>
                    <div className="obsLabel">{label}</div>
                    <div className="obsHint">{hint}</div>
                    <div className="obsBtns">
                      {options.map(opt=>(
                        <button key={opt} className={`obsBtn ${obs[key]===opt?(["Yes","Foul","Changed","High","Sour"].includes(opt)?"obsBtnRed":"obsBtnGreen"):""}`} onClick={()=>of(key,opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="actionRow">
                <button className="btnPrimary" onClick={runTests} disabled={pipeline.running}>
                  {pipeline.running?<><span className="spinner"/>Processing...</>:"▶  Run Chemical Stability Tests"}
                </button>
                <button className="btnGhost" onClick={resetForm} disabled={pipeline.running}>New Sample</button>
                <button className="btnGhost" onClick={downloadReport} disabled={!pipeline.results}>↓ Download JSON</button>
              </div>

              <div className="progressPanel">
                <div className="pTop">
                  <span className="muted small">Pipeline Stage</span>
                  <span className={`pStage mono ${pipeline.running?"pulsing":""}`}>{pipeline.stage}</span>
                </div>
                <div className="pBarWrap">
                  <div className="pBar"><div className="pFill" style={{width:`${pipeline.progress}%`}}/></div>
                  <span className="pPct mono">{pipeline.progress}%</span>
                </div>
                <div className="pMeta">
                  <div className="pMetaRow"><span className="muted">Request ID</span><span className="mono small">{pipeline.lastRequestId||"—"}</span></div>
                  <div className="pMetaRow"><span className="muted">Run ID</span><span className="mono small">{pipeline.lastRunId||"—"}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: RESULTS ── */}
        <section className="section">
          <div className="secHeader">
            <div className="secLeft">
              <span className="secNum">02</span>
              <div>
                <h2 className="secTitle">Chemical Analysis &amp; Test Results</h2>
                <p className="secSub">Structured API output with stability scores, chemical metrics, safe range comparisons, and routing verdict.</p>
              </div>
            </div>
            {pipeline.results && (
              <div className="tabRow">
                {["results","json","logs"].map(t=>(
                  <button key={t} className={`tab ${activeTab===t?"tabActive":""}`} onClick={()=>setActiveTab(t)}>
                    {t==="results"?"Analysis":t==="json"?"JSON Output":"Audit Logs"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!pipeline.results ? (
            <div className="emptyState">
              <div className="emptyIcon">🧪</div>
              <div className="emptyTitle">No results generated yet</div>
              <div className="emptyDesc">Fill the intake form above and click <strong>Run Chemical Stability Tests</strong> to generate a full structured report.</div>
            </div>
          ) : (
            <>
              {activeTab==="results" && (
                <div className="resultsLayout">
                  <div className={`card verdictCard vcard-${pipeline.results.results.finalVerdict.replace(" ","-").toLowerCase()}`}>
                    <div className="vLabel">Final Verdict</div>
                    <div className="vValue">{pipeline.results.results.finalVerdict}</div>
                    <div className={`tag ${vtag(pipeline.results.results.finalVerdict)}`}>{pipeline.results.results.finalVerdict}</div>
                    <div className="vRec">{pipeline.results.results.recommendationRoute}</div>
                  </div>
                  <div className="scoreQuad">
                    <Score label="Stability Score" value={pipeline.results.results.scores.stabilityScore} max={100} invert={false}/>
                    <Score label="Microbial Risk" value={pipeline.results.results.scores.microbialRisk} max={100} invert/>
                    <Score label="Physical Risk" value={pipeline.results.results.scores.physicalRisk} max={100} invert/>
                    <Score label="Expiry Risk" value={pipeline.results.results.scores.expiryRisk} max={40} invert/>
                  </div>
                  <div className="card metricsCard">
                    <div className="metricsTitle">Chemical Indicator Metrics</div>
                    <div className="mTable">
                      <div className="mHead"><div>Metric</div><div>Measured</div><div>Safe Range</div><div>Status</div></div>
                      {pipeline.results.results.chemicalMetrics.map((m,i)=>(
                        <div className="mRow" key={i}>
                          <div className="fw">{m.name}</div>
                          <div className="mono">{m.value}</div>
                          <div className="mono muted">{m.safeRange}</div>
                          <div><span className={`tag ${stag(m.statusTone)}`}>{m.status}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab==="json" && (
                <div className="card">
                  <div className="jsonHeader">
                    <span className="tag tag-ok mono">200 OK</span>
                    <span className="muted">application/json</span>
                    <span className="mono muted small">{pipeline.results.apiMeta.requestId}</span>
                  </div>
                  <pre className="jsonPre mono">{pp(pipeline.results)}</pre>
                </div>
              )}
              {activeTab==="logs" && (
                <div className="card logBox mono">
                  {auditLogs.map((l,i)=><div key={i} className={`logLine ${l.includes("[INFO]")?"logInfo":"logErr"}`}>{l}</div>)}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── SECTION 3: QUEUE & HISTORY ── */}
        <section className="section">
          <div className="secHeader">
            <div className="secLeft">
              <span className="secNum">03</span>
              <div>
                <h2 className="secTitle">Sample Queue &amp; Run History</h2>
                <p className="secSub">All submitted samples, recent test run records, and saved lots.</p>
              </div>
            </div>
            {savedLots.length>0&&<button className="btnViewSaved" onClick={()=>setShowSaved(true)}>View Saved Lots ({savedLots.length})</button>}
          </div>

          <div className="twoColEven">
            <div className="card">
              <div className="cardHead">
                <h3 className="cardTitle">Sample Queue</h3>
                <span className="countBadge">{sampleQueue.length} items</span>
              </div>
              <div className="miniTable">
                <div className="miniHead"><div>Sample ID</div><div>Product</div><div>Batch</div><div>Status</div></div>
                {sampleQueue.map(s=>(
                  <div className="miniRow" key={s.sampleId}>
                    <div className="mono small">{s.sampleId}</div><div>{s.productType}</div>
                    <div className="mono small">{s.batchNo}</div>
                    <div><span className={`tag ${s.status==="Processed"?"tag-ok":"tag-warn"}`}>{s.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="cardHead">
                <h3 className="cardTitle">Recent Test Runs</h3>
                <span className="countBadge">{recentRuns.length} runs</span>
              </div>
              <div className="miniTable">
                <div className="miniHead"><div>Run ID</div><div>Product</div><div>Verdict</div><div>Score</div></div>
                {recentRuns.map(r=>(
                  <div className="miniRow" key={r.runId}>
                    <div className="mono small">{r.runId}</div><div>{r.productType}</div>
                    <div><span className={`tag ${vtag(r.verdict)}`}>{r.verdict}</span></div>
                    <div className="mono fw">{r.stabilityScore}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {savedLots.length>0 && (
            <div className="card" style={{marginTop:16}}>
              <div className="cardHead">
                <h3 className="cardTitle">Saved Lots</h3>
                <span className="countBadge">{savedLots.length} saved</span>
              </div>
              <div className="savedLotsGrid">
                {savedLots.map(lot=>(
                  <div className="savedLotCard" key={lot.id}>
                    <div className="savedLotTop">
                      <span className="mono small fw">{lot.id}</span>
                      <span className={`tag ${vtag(lot.verdict)}`}>{lot.verdict}</span>
                    </div>
                    <div className="savedLotProd">{lot.productType} — {lot.batchNo}</div>
                    <div className="savedLotMeta">{lot.storageCondition} · {lot.packagingStatus}</div>
                    {lot.score!==null&&<div className="savedLotScore">Score: <strong>{lot.score}/100</strong></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ══ FOOTER — matches screenshot exactly ══ */}
        <footer className="footer">
          <div className="footerMain">
            <div className="footerGrid">

              {/* Col 1: Brand */}
              <div className="footerBrand">
                <div className="footerLogo">
                  <div className="footerLogoIcon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C9 2 5 5 5 10c0 3 1.5 5.5 3.5 7.5C10 19 12 20 12 20s2-1 3.5-2.5C17.5 15.5 19 13 19 10c0-5-4-8-7-8z" fill="white" opacity="0.9"/>
                      <path d="M12 7v7M9.5 11.5L12 14l2.5-2.5" stroke="rgba(0,80,40,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="footerLogoText">SecondLife <strong>Foods</strong></span>
                </div>
                <p className="footerBrandDesc">
                  Transforming expired, packaged goods into valuable resources to reduce food waste and nourish animals.
                </p>
                <div className="footerSocials">
                  <a href="#" className="footerSocialBtn" aria-label="Facebook">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </a>
                  <a href="#" className="footerSocialBtn" aria-label="Twitter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                  </a>
                  <a href="#" className="footerSocialBtn" aria-label="LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
              </div>

              {/* Col 2: Contact */}
              <div className="footerCol">
                <div className="footerColTitle">Contact</div>
                <div className="footerContactList">
                  <a href="mailto:contact@secondlifefoods.org" className="footerContactRow">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    contact@secondlifefoods.org
                  </a>
                  <a href="tel:+11234567890" className="footerContactRow">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5 19.79 19.79 0 01.22 2.84 2 2 0 012.22 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                    +1 (123) 456-7890
                  </a>
                  <div className="footerContactRow">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>123 Green St.<br/>Cityname, ST 12345</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Quick Links */}
              <div className="footerCol">
                <div className="footerColTitle">Quick Links</div>
                <div className="footerLinks">
                  {[
                    {label:"Home", path:"/home"},
                    {label:"Donate Food Lot", path:"/create-lot"},
                    {label:"Create Lot", path:"/create"},
                    {label:"Track Lot", path:"/track"},
                  ].map(l=>(
                    <button key={l.label} className="footerLink" onClick={()=>navigate(l.path)}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Col 4: Resources */}
              <div className="footerCol">
                <div className="footerColTitle">Resources</div>
                <div className="footerLinks">
                  {[
                    {label:"Knowledge Pocket", path:"#"},
                    {label:"QR Scanner", path:"/qr"},
                    {label:"Admin Panel", path:"#"},
                    {label:"Testing Screen", path:"/testing"},
                  ].map(l=>(
                    <button key={l.label} className="footerLink" onClick={()=>l.path!=="#"&&navigate(l.path)}>{l.label}</button>
                  ))}
                </div>
              </div>

              {/* Col 5: Newsletter */}
              <div className="footerCol">
                <div className="footerColTitle">Newsletter</div>
                <p className="footerNewsletterDesc">Subscribe to our newsletter</p>
                <div className="footerNewsletterForm">
                  <input className="footerNewsletterInput" placeholder="Enter your email" type="email"/>
                  <button className="footerNewsletterBtn">Subscribe</button>
                </div>
              </div>

            </div>
          </div>

          {/* Footer bottom bar */}
          <div className="footerBottom">
            <div className="footerBottomInner">
              <span>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</span>
              <div className="footerBottomLinks">
                <button className="footerBottomLink">Privacy Policy</button>
                <span className="footerBottomDivider">|</span>
                <button className="footerBottomLink">Terms of Service</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Score({label,value,max,invert}) {
  const v=Number(value), n=invert?(max-v)/max:v/max;
  const tone=n>=0.8?"ok":n>=0.55?"warn":"danger";
  return (
    <div className={`scoreCard scoreCard-${tone}`}>
      <div className="scoreTitle">{label}</div>
      <div className={`scoreVal score-${tone}`}>{value}<span className="scoreSuffix">/{max}</span></div>
      <div className="scoreBar"><div className={`scoreFill fill-${tone}`} style={{width:`${Math.round((v/max)*100)}%`}}/></div>
    </div>
  );
}