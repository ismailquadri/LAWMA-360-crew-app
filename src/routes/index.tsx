import { createFileRoute } from "@tanstack/react-router";
import { SupervisorDashboard } from "@/components/SupervisorDashboard";
import {
  BatteryFull,
  Building2,
  Camera,
  Check,
  ChevronRight,
  CloudUpload,
  Crosshair,
  Gauge,
  Home,
  MapPin,
  Nfc,
  Radio,
  ScanLine,
  ShieldAlert,
  Signal,
  SignalLow,
  Smartphone,
  Store,
  Tag,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crew Field App — Rugged Terminal Prototype" },
      { name: "description", content: "Interactive offline-first waste collection field terminal prototype." },
      { property: "og:title", content: "Crew Field App — Rugged Terminal Prototype" },
      { property: "og:description", content: "Interactive offline-first waste collection field terminal prototype." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CrewFieldPrototype,
});

type Network = "Depot Wi-Fi" | "4G" | "2G / Edge" | "Offline";
type Screen = "login" | "sync" | "diagnostics" | "route" | "camera" | "arrears" | "exception";
type Flash = "success" | "danger" | null;
type ScanOutcome = "valid" | "arrears" | "already-collected" | "wrong-zone" | "damaged-tag";
type PropertyType = "Home" | "Flats" | "Shop" | "Office" | "School";
export type AuditDecision = "requested" | "approved" | "denied";
export type AuditEntry = { key: number; property: string; reason: string; crew: string; decision: AuditDecision; time: string };

type StreetScenario = { id: string; address: string; street: string; type: PropertyType; service: string; distance: number; outcome: ScanOutcome };

const scenarios = [
  { id: "LAW-IKJ-0148", address: "18 Akinremi Street", street: "Akinremi Street", type: "Home", service: "1 household bin", distance: 12, outcome: "valid" },
  { id: "LAW-IKJ-0149", address: "Akinremi Court, Block B", street: "Akinremi Street", type: "Flats", service: "6 shared bins", distance: 28, outcome: "arrears" },
  { id: "LAW-IKJ-0150", address: "Musa Mini Mart", street: "Akinremi Street", type: "Shop", service: "2 commercial bins", distance: 41, outcome: "already-collected" },
  { id: "LAW-IKJ-0221", address: "7 Olowu Close", street: "Olowu Close", type: "Home", service: "1 household bin", distance: 18, outcome: "wrong-zone" },
  { id: "LAW-IKJ-0222", address: "Civic Primary School", street: "Olowu Close", type: "School", service: "4 large bins", distance: 35, outcome: "damaged-tag" },
  { id: "LAW-IKJ-0223", address: "Unity House Offices", street: "Olowu Close", type: "Office", service: "3 commercial bins", distance: 52, outcome: "valid" },
  { id: "LAW-IKJ-0310", address: "44 Kudirat Avenue", street: "Kudirat Avenue", type: "Home", service: "1 household bin", distance: 15, outcome: "valid" },
  { id: "LAW-IKJ-0311", address: "Kudirat Plaza", street: "Kudirat Avenue", type: "Shop", service: "5 commercial bins", distance: 33, outcome: "arrears" },
] satisfies readonly [StreetScenario, ...StreetScenario[]];

function getScenario(index: number): StreetScenario {
  return scenarios[index % scenarios.length] ?? scenarios[0];
}

function playTone(kind: "success" | "danger" | "camera") {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return;
  const audio = new AudioContextClass();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.type = kind === "danger" ? "sawtooth" : "sine";
  oscillator.frequency.setValueAtTime(kind === "danger" ? 145 : kind === "camera" ? 760 : 880, audio.currentTime);
  if (kind === "success") oscillator.frequency.setValueAtTime(1175, audio.currentTime + 0.09);
  gain.gain.setValueAtTime(0.18, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + (kind === "danger" ? 0.32 : 0.2));
  oscillator.start();
  oscillator.stop(audio.currentTime + (kind === "danger" ? 0.34 : 0.22));
}

declare global {
  interface Window { webkitAudioContext?: typeof AudioContext }
}

function CrewFieldPrototype() {
  const [screen, setScreen] = useState<Screen>("login");
  const [pin, setPin] = useState("");
  const [network, setNetwork] = useState<Network>("Depot Wi-Fi");
  const [manifest, setManifest] = useState(0);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [mode, setMode] = useState<"operator" | "supervisor">("operator");
  const [flash, setFlash] = useState<Flash>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(47);
  const [synced, setSynced] = useState(47);
  const [cached, setCached] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [clock, setClock] = useState("16:56");
  const [typeFilter, setTypeFilter] = useState<PropertyType | "All">("All");
  const [outcomeFilter, setOutcomeFilter] = useState<ScanOutcome | "All">("All");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const addAudit = useCallback((entry: Omit<AuditEntry, "key" | "time">) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    setAudit((list) => [{ ...entry, key: Date.now() + Math.random(), time }, ...list]);
  }, []);

  const isOffline = network === "Offline" || network === "2G / Edge";
  const networkIcon = network === "Depot Wi-Fi" ? Wifi : network === "4G" ? Signal : network === "2G / Edge" ? SignalLow : WifiOff;
  const NetworkIcon = networkIcon;
  const activeScenario = getScenario(scenarioIndex);

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen !== "sync") return;
    const timer = setInterval(() => setManifest((value) => Math.min(150, value + 10)), 90);
    return () => clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (manifest === 150 && screen === "sync") {
      const timer = setTimeout(() => setScreen("diagnostics"), 550);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [manifest, screen]);

  useEffect(() => {
    if (screen !== "diagnostics" || diagnosticStep >= 3) return;
    const timer = setTimeout(() => setDiagnosticStep((step) => step + 1), 650);
    return () => clearTimeout(timer);
  }, [diagnosticStep, screen]);

  useEffect(() => {
    if (isOffline || cached === 0) {
      setSyncing(false);
      if (syncTimer.current) clearInterval(syncTimer.current);
      return;
    }
    setSyncing(true);
    syncTimer.current = setInterval(() => {
      setCached((value) => {
        if (value <= 1) {
          setSyncing(false);
          if (syncTimer.current) clearInterval(syncTimer.current);
          return 0;
        }
        return value - 1;
      });
      setSynced((value) => Math.min(completed, value + 1));
    }, 650);
    return () => { if (syncTimer.current) clearInterval(syncTimer.current); };
  }, [network]);

  const flashScreen = useCallback((kind: Exclude<Flash, null>) => {
    setFlash(kind);
    setTimeout(() => setFlash(null), 500);
  }, []);

  const scan = useCallback(() => {
    if (mode !== "operator" || screen !== "route") return;
    if (activeScenario.outcome !== "valid") {
      playTone("danger");
      navigator.vibrate?.([80, 50, 80, 50, 80]);
      flashScreen("danger");
      setTimeout(() => setScreen(activeScenario.outcome === "arrears" ? "arrears" : "exception"), 260);
      return;
    }
    playTone("success");
    navigator.vibrate?.(110);
    flashScreen("success");
    setPhotoTaken(false);
    setTimeout(() => setScreen("camera"), 300);
  }, [activeScenario.outcome, flashScreen, mode, screen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      event.preventDefault();
      scan();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scan]);

  const capture = () => {
    playTone("camera");
    setPhotoTaken(true);
    setCompleted((value) => value + 1);
    if (isOffline) setCached((value) => value + 1);
    else setSynced((value) => value + 1);
    setStatuses((s) => ({ ...s, [activeScenario.id]: activeScenario.outcome === "valid" ? "Collected" : activeScenario.outcome === "arrears" ? "Overridden" : "Manual proof" }));
    setTimeout(() => { setScenarioIndex((value) => (value + 1) % scenarios.length); setScreen("route"); }, 900);
  };

  const advanceScenario = () => {
    const label: Record<ScanOutcome, string> = { valid: "Collected", arrears: "Skipped", "already-collected": "Duplicate", "wrong-zone": "Rejected", "damaged-tag": "Manual proof" };
    setStatuses((s) => ({ ...s, [activeScenario.id]: label[activeScenario.outcome] }));
    setScenarioIndex((value) => (value + 1) % scenarios.length); setScreen("route");
  };

  const openScenario = (index: number) => {
    setScenarioIndex(index);
    setMode("operator");
    setPhotoTaken(false);
    setScreen("route");
  };

  const filteredScenarios = scenarios
    .map((s, index) => ({ s, index }))
    .filter(({ s }) => (typeFilter === "All" || s.type === typeFilter) && (outcomeFilter === "All" || s.outcome === outcomeFilter));

  const startLogin = () => setScreen("sync");

  const deviceContent = useMemo(() => {
    if (mode === "supervisor") return <SupervisorDashboard network={network} completed={completed} cached={cached} audit={audit} addAudit={addAudit} />;
    if (screen === "login") return <LoginScreen pin={pin} setPin={setPin} onLogin={startLogin} />;
    if (screen === "sync") return <ManifestScreen manifest={manifest} />;
    if (screen === "diagnostics") return <DiagnosticsScreen step={diagnosticStep} onStart={() => setScreen("route")} />;
    if (screen === "camera") return <CameraScreen scenario={activeScenario} taken={photoTaken} onCapture={capture} />;
    if (screen === "arrears") return <ArrearsScreen scenario={activeScenario} onBack={advanceScenario} onOverride={() => { addAudit({ property: activeScenario.address, reason: "Arrears override requested", crew: "Babatunde A.", decision: "requested" }); setScreen("camera"); setPhotoTaken(false); }} />;
    if (screen === "exception") return <ExceptionScreen scenario={activeScenario} onResolve={activeScenario.outcome === "damaged-tag" ? () => { setScreen("camera"); setPhotoTaken(false); } : advanceScenario} />;
    return <RouteScreen scenarioIndex={scenarioIndex} completed={completed} synced={synced} onScan={scan} />;
  }, [activeScenario, addAudit, audit, completed, diagnosticStep, manifest, mode, network, photoTaken, pin, scenarioIndex, screen, synced, scan]);

  return (
    <main className="prototype-stage">
      <section className="presentation-copy" aria-label="Prototype overview">
        <div className="brand-mark"><span>CF</span></div>
        <p className="eyebrow">CREW FIELD APP / INTERACTIVE PROTOTYPE</p>
        <h1>Built for the street.<br />Not the office.</h1>
        <p className="intro">A zero-touch field workflow designed for loud routes, harsh weather, gloved hands, and unreliable networks.</p>

        <div className="control-panel">
          <p className="control-label">SIMULATE NETWORK</p>
          <div className="network-grid">
            {(["Depot Wi-Fi", "4G", "2G / Edge", "Offline"] as Network[]).map((item) => (
              <button key={item} className={network === item ? "control-button active" : "control-button"} onClick={() => setNetwork(item)}>
                {item === "Depot Wi-Fi" ? <Wifi /> : item === "4G" ? <Signal /> : item === "2G / Edge" ? <SignalLow /> : <WifiOff />}
                <span>{item}</span>
              </button>
            ))}
          </div>
          <div className="mode-switch" aria-label="App mode">
            <button className={mode === "operator" ? "selected" : ""} onClick={() => setMode("operator")}><Smartphone /> Operator</button>
            <button className={mode === "supervisor" ? "selected" : ""} onClick={() => setMode("supervisor")}><Users /> Supervisor</button>
          </div>
        </div>

        <div className="control-panel scenario-explorer">
          <p className="control-label">EXPLORE STREET SCENARIOS</p>
          <div className="filter-row" aria-label="Filter by property type">
            {(["All", "Home", "Flats", "Shop", "Office", "School"] as const).map((t) => (
              <button key={t} className={typeFilter === t ? "chip active" : "chip"} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <div className="filter-row" aria-label="Filter by scan outcome">
            {(["All", "valid", "arrears", "already-collected", "wrong-zone", "damaged-tag"] as const).map((o) => (
              <button key={o} className={outcomeFilter === o ? "chip active" : "chip"} onClick={() => setOutcomeFilter(o)}>{o === "All" ? "All outcomes" : outcomeLabel[o]}</button>
            ))}
          </div>
          <ul className="street-overview">
            {filteredScenarios.length === 0 && <li className="overview-empty">No properties match these filters.</li>}
            {filteredScenarios.map(({ s, index }) => (
              <li key={s.id} className={index === scenarioIndex ? "current" : ""}>
                <PropertyTypeIcon type={s.type} />
                <span className="ov-main"><strong>{s.address}</strong><small>{s.type} · {s.street}</small></span>
                <span className={`ov-outcome ${s.outcome}`}>{outcomeLabel[s.outcome]}</span>
                <span className="ov-status">{statuses[s.id] ?? (index === scenarioIndex ? "Current" : "Pending")}</span>
                <button onClick={() => openScenario(index)} aria-label={`Open scenario ${s.address}`}>Open</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="prototype-notes">
          <div><ScanLine /><span><strong>Physical trigger</strong>Click device trigger or press Spacebar</span></div>
          <div><Zap /><span><strong>Instant local write</strong>No loading states in the scanning loop</span></div>
        </div>
      </section>

      <section className="device-zone" aria-label="Rugged handheld simulator">
        <div className="device-shadow" />
        <div className="scanner-head">
          <div className="scanner-window"><span /></div>
          <div className="indicator-strip"><i className="ready" /><i /><i /></div>
        </div>
        <div className="device-body">
          <div className="speaker"><i /><i /><i /><i /><i /></div>
          <button className="side-key left-key" onClick={scan} aria-label="Side scan key" />
          <div className={`device-screen ${flash ? `flash-${flash}` : ""}`}>
            <header className="status-bar">
              <span className="status-network"><NetworkIcon /> {network}</span>
              <span>GPS <Crosshair /></span>
              <span><BatteryFull /> 84%</span>
              <time>{clock}</time>
            </header>
            {isOffline && screen !== "login" && mode === "operator" && (
              <div className="offline-banner"><WifiOff /> <strong>OFFLINE MODE</strong><span>{cached} {cached === 1 ? "record" : "records"} saved locally</span></div>
            )}
            {syncing && <div className="sync-banner"><CloudUpload /> <strong>SYNCING…</strong><span>{synced}/{completed} synced</span></div>}
            <div className="screen-content">{deviceContent}</div>
            <nav className="device-nav" aria-label="Device navigation">
              <button aria-label="Back" onClick={() => screen !== "login" && setScreen("route")}><ChevronRight className="back-icon" /></button>
              <span />
              <button aria-label="Home" onClick={() => setScreen(screen === "login" ? "login" : "route")}><i /></button>
            </nav>
          </div>
          <div className="device-badge"><ShieldAlert /> IP67</div>
          <div className="brand-plate">FIELDCORE <span>R6</span></div>
          <button className="physical-trigger" onClick={scan} aria-label="Pull physical scanner trigger">
            <span className="trigger-ridges"><i /><i /><i /></span>
            <strong>SCAN</strong>
          </button>
        </div>
        <div className="pistol-grip"><span /><i /></div>
        <p className="trigger-hint"><kbd>SPACE</kbd> hardware trigger</p>
      </section>
    </main>
  );
}

function LoginScreen({ pin, setPin, onLogin }: { pin: string; setPin: (value: string) => void; onLogin: () => void }) {
  const add = (number: string) => {
    const next = (pin + number).slice(0, 4);
    setPin(next);
    if (next.length === 4) setTimeout(onLogin, 160);
  };
  return <div className="login-screen">
    <div className="app-emblem"><RecycleMark /></div>
    <div><p className="screen-kicker">DEPOT ACCESS</p><h2>Start your shift</h2><p>Enter your 4-digit crew PIN</p></div>
    <div className="pin-dots">{[0, 1, 2, 3].map((n) => <span className={pin.length > n ? "filled" : ""} key={n} />)}</div>
    <div className="keypad">{["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => <button key={n} onClick={() => add(n)}>{n}</button>)}<button className="nfc-key" onClick={() => { setPin("1234"); setTimeout(onLogin, 160); }}><Nfc /></button><button onClick={() => add("0")}>0</button><button onClick={() => setPin(pin.slice(0, -1))}><X /></button></div>
    <button className="badge-login" onClick={() => { setPin("1234"); setTimeout(onLogin, 160); }}><Nfc /> TAP NFC CREW BADGE</button>
  </div>;
}

function ManifestScreen({ manifest }: { manifest: number }) {
  return <div className="center-screen">
    <div className="sync-rings"><CloudUpload /></div>
    <p className="screen-kicker">DEPOT WI-FI CONNECTED</p>
    <h2>Loading today’s route</h2>
    <div className="manifest-number">{manifest}<span>/150</span></div>
    <p>properties downloaded</p>
    <div className="progress-track"><span style={{ width: `${manifest / 1.5}%` }} /></div>
    <div className="secure-note"><Check /> Manifest verified & encrypted</div>
  </div>;
}

function DiagnosticsScreen({ step, onStart }: { step: number; onStart: () => void }) {
  const checks = [
    { icon: BatteryFull, label: "Battery", detail: "84% · 9h 20m remaining" },
    { icon: ScanLine, label: "Barcode scanner", detail: "Ready · Laser calibrated" },
    { icon: Crosshair, label: "GPS lock", detail: "± 3 metres accuracy" },
  ];
  return <div className="diagnostics-screen">
    <p className="screen-kicker">PRE-SHIFT CHECK</p><h2>Hardware diagnostics</h2><p className="muted-copy">Confirm the terminal is field-ready.</p>
    <div className="diagnostic-list">{checks.map(({ icon: Icon, label, detail }, index) => <div className={step > index ? "diagnostic-row passed" : "diagnostic-row"} key={label}><Icon /><span><strong>{label}</strong><small>{step > index ? detail : "Checking…"}</small></span>{step > index && <Check />}</div>)}</div>
    <button className="primary-action" disabled={step < 3} onClick={onStart}>{step < 3 ? "RUNNING CHECKS…" : "START ROUTE"}<ChevronRight /></button>
  </div>;
}

function PropertyTypeIcon({ type }: { type: PropertyType }) {
  const Icon = type === "Home" ? Home : type === "Shop" ? Store : Building2;
  return <Icon aria-hidden="true" />;
}

function RouteScreen({ scenarioIndex, completed, synced, onScan }: { scenarioIndex: number; completed: number; synced: number; onScan: () => void }) {
  const visibleScenarios = [0, 1, 2].map((offset) => getScenario(scenarioIndex + offset));
  const current = getScenario(scenarioIndex);
  return <div className="route-screen">
    <header className="route-header"><div><p className="screen-kicker">ZONE IKJ-04 · STOP {completed + 1}</p><h2>{current.street}</h2></div><div className="route-count"><strong>{completed}</strong><span>/150</span></div></header>
    <div className="route-progress"><span style={{ width: `${(completed / 150) * 100}%` }} /></div>
    <div className="street-strip"><div className="route-line"><i className="done-dot" /><i className="current-dot" /><i /><i /></div><MapPin /><span><strong>{current.address}</strong><small>Next stop · {current.distance} m ahead</small></span></div>
    <div className="scan-callout"><div className="laser"><ScanLine /></div><span><strong>READY TO SCAN</strong><small>Point at bin tag and pull trigger</small></span></div>
    <div className="property-list">{visibleScenarios.map((property, i) => <div className={i === 0 ? "property active" : "property"} key={property.id}><span className="property-index"><PropertyTypeIcon type={property.type} /></span><span><strong>{property.address}</strong><small><b>{property.type}</b> · {property.service}</small><small>{property.id}</small></span>{i === 0 ? <Radio /> : <ChevronRight />}</div>)}</div>
    <footer className="route-footer"><span><CloudUpload /> <strong>{synced}/150</strong> synced</span><button onClick={onScan}><ScanLine /> MANUAL SCAN</button></footer>
  </div>;
}

function CameraScreen({ scenario, taken, onCapture }: { scenario: StreetScenario; taken: boolean; onCapture: () => void }) {
  return <div className={`camera-screen ${taken ? "captured" : ""}`}>
    <div className="camera-scene"><div className="wall-texture" /><div className="wheelie-bin"><span className="bin-lid" /><span className="bin-body"><i /></span><b /><b /></div><div className="focus-frame"><i /><i /><i /><i /></div>{taken && <div className="capture-confirm"><Check /><strong>PROOF SAVED</strong><span>Local write · 34ms</span></div>}<div className="geo-stamp"><span><MapPin /> 6.6018° N, 3.3515° E</span><span>01 OCT 2026 · 16:56:42</span><strong>{scenario.id} · {scenario.type.toUpperCase()}</strong></div></div>
    <div className="camera-controls"><span>{scenario.service}</span><button onClick={onCapture} disabled={taken} aria-label="Take proof photo"><i /></button><Camera /></div>
  </div>;
}

const outcomeLabel: Record<ScanOutcome, string> = { valid: "Valid", arrears: "Arrears", "already-collected": "Duplicate", "wrong-zone": "Wrong zone", "damaged-tag": "Damaged tag" };

const nextSteps: Record<Exclude<ScanOutcome, "valid">, string[]> = {
  arrears: ["Leave bin uncollected", "Skip, or ask supervisor to override"],
  "already-collected": ["No pickup needed", "Move to next property"],
  "wrong-zone": ["Do not collect", "Reject tag — IKJ-07 crew notified"],
  "damaged-tag": ["Confirm address on door", "Capture proof photo — tag reported"],
};

function NextSteps({ outcome }: { outcome: Exclude<ScanOutcome, "valid"> }) {
  return <ol className="next-steps" aria-label="Next steps">{nextSteps[outcome].map((step, i) => <li key={step}><b>{i + 1}</b>{step}</li>)}</ol>;
}

function ArrearsScreen({ scenario, onBack, onOverride }: { scenario: StreetScenario; onBack: () => void; onOverride: () => void }) {
  return <div className="arrears-screen"><div className="alert-icon"><ShieldAlert /></div><p className="screen-kicker">COLLECTION BLOCKED</p><h2>ACCOUNT<br />ARREARS</h2><div className="do-not">DO NOT COLLECT</div><div className="account-detail"><span>PROPERTY</span><strong>{scenario.address}</strong><span>TYPE</span><strong>{scenario.type}</strong><span>ACCOUNT</span><strong>{scenario.id}</strong></div><NextSteps outcome="arrears" /><button className="danger-back" onClick={onBack}><X /> SKIP PROPERTY</button><button className="override" onClick={onOverride}><ShieldAlert /> Supervisor override</button></div>;
}

function ExceptionScreen({ scenario, onResolve }: { scenario: StreetScenario; onResolve: () => void }) {
  const details = scenario.outcome === "already-collected"
    ? { kicker: "DUPLICATE SCAN", lines: ["ALREADY", "COLLECTED"], message: "Proof recorded today at 14:32", action: "NEXT PROPERTY", icon: Check }
    : scenario.outcome === "wrong-zone"
      ? { kicker: "TAG MISMATCH", lines: ["WRONG", "ZONE"], message: "Assigned to Zone IKJ-07", action: "REJECT TAG", icon: MapPin }
      : { kicker: "TAG UNREADABLE", lines: ["DAMAGED", "BIN TAG"], message: "Verify property and capture proof", action: "ENTER MANUALLY", icon: Tag };
  const Icon = details.icon;
  const outcome = scenario.outcome === "valid" ? "damaged-tag" : scenario.outcome;
  return <div className={`exception-screen ${scenario.outcome}`}><div className="exception-icon"><Icon /></div><p className="screen-kicker">{details.kicker}</p><h2>{details.lines.map((line) => <span key={line}>{line}</span>)}</h2><div className="exception-message">{details.message}</div><div className="account-detail"><span>PROPERTY</span><strong>{scenario.address}</strong><span>TYPE</span><strong>{scenario.type}</strong><span>TAG</span><strong>{scenario.id}</strong></div><NextSteps outcome={outcome} /><button className="exception-action" onClick={onResolve}><ChevronRight /> {details.action}</button></div>;
}

function RecycleMark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 31 17H17L24 5ZM10 21l7 4-7 12V21Zm28 0v16L31 25l7-4ZM15 39h18l-4-7H19l-4 7Z" fill="currentColor" /></svg>;
}