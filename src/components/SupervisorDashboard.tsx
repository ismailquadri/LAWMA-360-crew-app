import { BatteryFull, Bell, Check, ChevronLeft, ChevronRight, ClipboardList, CloudUpload, Gauge, MapPin, ShieldAlert, Users, X } from "lucide-react";
import { useState } from "react";
import type { AuditEntry } from "@/routes/index";

type Network = "Depot Wi-Fi" | "4G" | "2G / Edge" | "Offline";
type Crew = { name: string; zone: string; done: number; total: number; battery: number; pending: number; online: boolean; location: string };
type Override = { id: string; crew: string; address: string; status: "pending" | "approved" | "denied" };
type View = { kind: "home" } | { kind: "crew"; name: string } | { kind: "overrides" } | { kind: "alert" } | { kind: "audit" };

export function SupervisorDashboard({ network, completed, cached, audit, addAudit }: { network: Network; completed: number; cached: number; audit: AuditEntry[]; addAudit: (entry: Omit<AuditEntry, "key" | "time">) => void }) {
  const [view, setView] = useState<View>({ kind: "home" });
  const [pinged, setPinged] = useState<string[]>([]);
  const [syncRequested, setSyncRequested] = useState<string[]>([]);
  const [swapSent, setSwapSent] = useState(false);
  const [overrides, setOverrides] = useState<Override[]>([
    { id: "LAW-IKJ-0149", crew: "Babatunde A.", address: "Akinremi Court, Block B", status: "pending" },
    { id: "LAW-IKJ-0311", crew: "Musa K.", address: "Kudirat Plaza", status: "pending" },
  ]);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 1600); };

  const crew: Crew[] = [
    { name: "Babatunde A.", zone: "Zone IKJ-04", done: completed, total: 150, battery: 84, pending: cached, online: true, location: "Akinremi Street" },
    { name: "Musa K.", zone: "Zone IKJ-05", done: syncRequested.includes("Musa K.") ? 94 : 87, total: 150, battery: 61, pending: syncRequested.includes("Musa K.") ? 0 : 7, online: syncRequested.includes("Musa K."), location: "Olowu Close" },
    { name: "Adaeze N.", zone: "Zone IKJ-06", done: 122, total: 150, battery: swapSent ? 100 : 43, pending: syncRequested.includes("Adaeze N.") ? 0 : 2, online: true, location: "Kudirat Avenue" },
  ];
  const totalDone = crew.reduce((n, c) => n + c.done, 0);
  const totalAll = crew.reduce((n, c) => n + c.total, 0);
  const pct = Math.round((totalDone / totalAll) * 100);
  const pendingSync = crew.reduce((n, c) => n + c.pending, 0);
  const openOverrides = overrides.filter((o) => o.status === "pending").length;

  const decide = (id: string, status: "approved" | "denied") => {
    const target = overrides.find((o) => o.id === id);
    setOverrides((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    if (target) addAudit({ property: target.address, reason: `Arrears override ${status}`, crew: target.crew, decision: status });
    notify(status === "approved" ? "Override approved — crew notified" : "Override denied — do not collect");
  };

  let body: React.ReactNode;
  if (view.kind === "crew") {
    const c = (crew.find((x) => x.name === view.name) ?? crew[0]) as Crew;
    body = <div className="sup-detail">
      <button className="sup-back" onClick={() => setView({ kind: "home" })}><ChevronLeft /> Fleet</button>
      <p className="screen-kicker">{c.zone}</p><h2>{c.name}</h2>
      <div className="sup-stats">
        <div><span>PROGRESS</span><strong>{Math.round((c.done / c.total) * 100)}%</strong><small>{c.done}/{c.total}</small></div>
        <div><span>BATTERY</span><strong className={c.battery < 50 ? "warn" : ""}>{c.battery}%</strong><small>{c.online ? "Online" : "Offline"}</small></div>
        <div><span>PENDING</span><strong>{c.pending}</strong><small>unsynced</small></div>
      </div>
      <div className="sup-location"><MapPin /> Last seen · {c.location}</div>
      <button className="sup-action" disabled={pinged.includes(c.name)} onClick={() => { setPinged((p) => [...p, c.name]); notify(`Message sent to ${c.name}`); }}>
        <Bell /> {pinged.includes(c.name) ? "CREW PINGED" : "PING CREW"}
      </button>
      <button className="sup-action secondary" disabled={c.pending === 0} onClick={() => { setSyncRequested((s) => [...s, c.name]); notify(`Sync forced for ${c.name}`); }}>
        <CloudUpload /> {c.pending === 0 ? "ALL RECORDS SYNCED" : `FORCE SYNC (${c.pending})`}
      </button>
    </div>;
  } else if (view.kind === "overrides") {
    body = <div className="sup-detail">
      <button className="sup-back" onClick={() => setView({ kind: "home" })}><ChevronLeft /> Fleet</button>
      <p className="screen-kicker">ARREARS OVERRIDES</p><h2>Approval queue</h2>
      <div className="override-list">{overrides.map((o) => <div className="override-row" key={o.id}>
        <span><strong>{o.address}</strong><small>{o.crew} · {o.id}</small></span>
        {o.status === "pending" ? <div className="override-buttons">
          <button className="approve" aria-label={`Approve ${o.address}`} onClick={() => decide(o.id, "approved")}><Check /></button>
          <button className="deny" aria-label={`Deny ${o.address}`} onClick={() => decide(o.id, "denied")}><X /></button>
        </div> : <span className={`override-status ${o.status}`}>{o.status.toUpperCase()}</span>}
      </div>)}</div>
    </div>;
  } else if (view.kind === "audit") {
    body = <div className="sup-detail">
      <button className="sup-back" onClick={() => setView({ kind: "home" })}><ChevronLeft /> Fleet</button>
      <p className="screen-kicker">AUDIT TRAIL</p><h2>Override log</h2>
      {audit.length === 0 ? <p className="audit-empty">No override activity yet. Approve or deny an override, or use supervisor override on the operator screen.</p> :
        <div className="audit-list">{audit.map((entry) => <div className="audit-row" key={entry.key}>
          <span className={`audit-badge ${entry.decision}`}>{entry.decision.toUpperCase()}</span>
          <span className="audit-main"><strong>{entry.property}</strong><small>{entry.reason} · {entry.crew}</small></span>
          <time>{entry.time}</time>
        </div>)}</div>}
    </div>;
  } else if (view.kind === "alert") {
    body = <div className="sup-detail">
      <button className="sup-back" onClick={() => setView({ kind: "home" })}><ChevronLeft /> Fleet</button>
      <p className="screen-kicker">DEVICE ALERT</p><h2>Low battery</h2>
      <div className="sup-location"><Gauge /> Adaeze N. · {swapSent ? "100% after swap" : "43% · ~3h left"}</div>
      <button className="sup-action" disabled={swapSent} onClick={() => { setSwapSent(true); notify("Spare battery dispatched"); }}>
        <BatteryFull /> {swapSent ? "BATTERY SWAPPED" : "SEND SPARE BATTERY"}
      </button>
      <button className="sup-action secondary" onClick={() => setView({ kind: "crew", name: "Adaeze N." })}><Users /> VIEW CREW</button>
    </div>;
  } else {
    body = <>
      <header><div><p className="screen-kicker">FLEET CONTROL</p><h2>Good afternoon, Chidi</h2></div><div className="avatar">CO</div></header>
      <div className="fleet-summary"><div><span>ZONE PROGRESS</span><strong>{pct}%</strong><small>{totalDone} of {totalAll} properties</small></div><div className="ring-chart" style={{ background: `conic-gradient(var(--accent) ${pct}%, var(--muted) 0)` }}><span>{pct}</span></div></div>
      <div className="metric-grid">
        <button onClick={() => setView({ kind: "overrides" })}><ShieldAlert /><span><strong>{openOverrides}</strong><small>Overrides</small></span></button>
        <div><CloudUpload /><span><strong>{pendingSync}</strong><small>Pending sync</small></span></div>
        <button onClick={() => setView({ kind: "audit" })}><ClipboardList /><span><strong>{audit.length}</strong><small>Audit log</small></span></button>
      </div>
      <div className="section-title"><span>CREW STATUS · TAP FOR DETAILS</span><small>LIVE · {network}</small></div>
      <div className="crew-list">{crew.map((p) => <button className="crew-row" key={p.name} onClick={() => setView({ kind: "crew", name: p.name })}><div className={`crew-dot ${p.online ? "online" : "offline"}`} /><span className="crew-name"><strong>{p.name}</strong><small>{p.zone} · {Math.round((p.done / p.total) * 100)}% complete</small></span><span className={p.battery < 50 ? "battery warning" : "battery"}><BatteryFull />{p.battery}%</span>{p.pending > 0 && <span className="pending">{p.pending} pending</span>}</button>)}</div>
      {!swapSent && <button className="fleet-alert" onClick={() => setView({ kind: "alert" })}><Gauge /><span><strong>1 device needs attention</strong><small>Adaeze’s battery below 50%</small></span><ChevronRight /></button>}
    </>;
  }

  return <div className="supervisor-screen">{body}{toast && <div className="sup-toast"><Check /> {toast}</div>}</div>;
}
