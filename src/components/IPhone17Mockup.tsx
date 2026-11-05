import { useState, useEffect } from "react";
import {
  BatteryFull,
  Check,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  Home,
  MapPin,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Smartphone,
  Trash2,
  Truck,
  Wifi,
  Zap,
} from "lucide-react";

interface IPhone17MockupProps {
  initialRoute?: string;
  className?: string;
}

export type ResidentTab = "home" | "bins" | "activity" | "wallet" | "report";

export function IPhone17Mockup({ initialRoute = "/", className = "" }: IPhone17MockupProps) {
  const [useIframe, setUseIframe] = useState(true);
  const [iframePath, setIframePath] = useState(initialRoute);
  const [iframeKey, setIframeKey] = useState(0);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<ResidentTab>("home");
  const [walletBalance, setWalletBalance] = useState(14500);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [clock, setClock] = useState("09:41");
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const baseUrl = "https://smartwaste360-mobile.vercel.app";
  const iframeUrl = `${baseUrl}${iframePath === "/" ? "" : iframePath}`;

  const reloadIframe = () => {
    setIframeKey((k) => k + 1);
  };

  const jumpToRoute = (path: string, tab: ResidentTab) => {
    setIframePath(path);
    setActiveTab(tab);
    setIframeKey((k) => k + 1);
  };

  return (
    <div className={`iphone-presentation-wrapper flex flex-col items-center ${className}`}>
      {/* Presenter Quick Toolbar */}
      <div className="presenter-hud mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-xs backdrop-blur-md w-full max-w-[430px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Smartphone className="size-3.5" />
          <span className="font-semibold text-white">iPhone 17 Pro</span>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">Resident App</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseIframe(!useIframe)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              useIframe
                ? "bg-emerald-500 text-black shadow-sm"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
            title="Toggle between Live Web App and Deterministic Simulation"
          >
            <Globe className="size-3" />
            <span>{useIframe ? "Live App" : "Simulation"}</span>
          </button>
          {useIframe && (
            <button
              onClick={reloadIframe}
              className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20 transition-colors"
              title="Reload resident view"
            >
              <RefreshCw className="size-3" />
            </button>
          )}
          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20 transition-colors"
            title="Open standalone resident app in new tab"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Route Quick Jump Tabs for Presenters */}
      <div className="quick-jump-bar mb-4 flex w-full max-w-[430px] items-center justify-between gap-1 overflow-x-auto rounded-xl bg-white/5 p-1 text-[11px] text-white/70">
        <button
          onClick={() => jumpToRoute("/", "home")}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            activeTab === "home" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "hover:text-white"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => jumpToRoute("/bins", "bins")}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            activeTab === "bins" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "hover:text-white"
          }`}
        >
          Smart Bins
        </button>
        <button
          onClick={() => jumpToRoute("/activity", "activity")}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            activeTab === "activity" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "hover:text-white"
          }`}
        >
          Activity
        </button>
        <button
          onClick={() => jumpToRoute("/wallet", "wallet")}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            activeTab === "wallet" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "hover:text-white"
          }`}
        >
          Wallet
        </button>
        <button
          onClick={() => jumpToRoute("/report", "report")}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            activeTab === "report" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "hover:text-white"
          }`}
        >
          Report
        </button>
      </div>

      {/* iPhone 17 Device Body */}
      <div className="relative select-none">
        {/* Antenna bands */}
        <div className="absolute -left-[4px] top-[90px] h-[4px] w-[4px] bg-neutral-600/60" />
        <div className="absolute -left-[4px] bottom-[90px] h-[4px] w-[4px] bg-neutral-600/60" />
        <div className="absolute -right-[4px] top-[90px] h-[4px] w-[4px] bg-neutral-600/60" />
        <div className="absolute -right-[4px] bottom-[90px] h-[4px] w-[4px] bg-neutral-600/60" />

        {/* Left Side Hardware Buttons */}
        {/* Action Button */}
        <div className="absolute -left-[3.5px] top-[115px] h-[28px] w-[3.5px] rounded-l-sm bg-gradient-to-r from-neutral-600 to-neutral-400 shadow-sm" />
        {/* Volume Up */}
        <div className="absolute -left-[3.5px] top-[158px] h-[52px] w-[3.5px] rounded-l-sm bg-gradient-to-r from-neutral-600 to-neutral-400 shadow-sm" />
        {/* Volume Down */}
        <div className="absolute -left-[3.5px] top-[222px] h-[52px] w-[3.5px] rounded-l-sm bg-gradient-to-r from-neutral-600 to-neutral-400 shadow-sm" />

        {/* Right Side Hardware Buttons */}
        {/* Side / Power Button */}
        <div className="absolute -right-[3.5px] top-[170px] h-[78px] w-[3.5px] rounded-r-sm bg-gradient-to-l from-neutral-600 to-neutral-400 shadow-sm" />
        {/* iPhone 17 Camera Control Button (Recessed capacitive surface) */}
        <div className="absolute -right-[3.5px] top-[480px] h-[64px] w-[3.5px] rounded-r-sm bg-gradient-to-l from-neutral-500 to-neutral-300 opacity-90 shadow-inner" />

        {/* Outer Titanium Chassis */}
        <div
          className="relative h-[844px] w-[398px] rounded-[55px] p-[10px] shadow-2xl transition-all duration-300"
          style={{
            background: "linear-gradient(145deg, #3f4044 0%, #202124 35%, #2a2b2e 70%, #161719 100%)",
            boxShadow:
              "0 0 0 1px rgba(255, 255, 255, 0.16), 0 0 0 3px rgba(0, 0, 0, 0.85), 0 35px 80px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Inner Titanium Edge Chamfer */}
          <div
            className="relative h-full w-full rounded-[47px] bg-black p-[3.5px]"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Active Display Surface */}
            <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-[#09120e] text-white">
              {/* Dynamic Island */}
              <div
                onClick={() => setIslandExpanded(!islandExpanded)}
                className={`absolute left-1/2 top-3 z-40 -translate-x-1/2 cursor-pointer bg-black text-white transition-all duration-300 ease-out flex items-center justify-between px-3 ${
                  islandExpanded
                    ? "h-[54px] w-[340px] rounded-[28px] shadow-xl ring-1 ring-white/10"
                    : "h-[33px] w-[124px] rounded-full shadow-md hover:scale-105"
                }`}
                title="Click to toggle Dynamic Island Live Activity"
              >
                {islandExpanded ? (
                  <div className="flex w-full items-center justify-between text-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Truck className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">LAWMA Truck #04</p>
                        <p className="text-[10px] text-white/60">Ikeja Zone · Next stop: 18 Olowu St</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      8 min
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Front Camera Lens + Sensor glint */}
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500/80 animate-pulse" />
                      <span className="text-[9px] font-medium text-white/70 tracking-tight">LAWMA</span>
                    </div>
                    <div className="relative size-3 rounded-full bg-neutral-900 ring-1 ring-neutral-800">
                      <div className="absolute inset-0.5 rounded-full bg-indigo-950/70" />
                    </div>
                  </>
                )}
              </div>

              {/* iOS Top Status Bar */}
              <div className="relative z-30 flex h-11 items-center justify-between px-7 text-[12px] font-semibold text-white/90">
                <span className="tracking-tight">{clock}</span>
                <div className="flex items-center gap-1.5">
                  <Signal className="size-3 text-white" />
                  <span className="text-[10px] font-bold tracking-tight">5G</span>
                  <Wifi className="size-3 text-white" />
                  <div className="flex items-center gap-0.5">
                    <div className="h-2.5 w-5 rounded-[3px] border border-white/70 p-[1px]">
                      <div className="h-full w-[85%] rounded-[1.5px] bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative h-[calc(100%-44px)] w-full overflow-hidden">
                {useIframe ? (
                  /* Live Web App Iframe */
                  <div className="relative h-full w-full">
                    <iframe
                      key={iframeKey}
                      src={iframeUrl}
                      title="LAWMA 360 Resident Mobile App"
                      className="h-full w-full border-0 bg-transparent"
                      loading="eager"
                      allow="geolocation; camera; microphone"
                    />
                  </div>
                ) : (
                  /* High-Fidelity Client-Side Fallback Simulation */
                  <ResidentSimulationView
                    tab={activeTab}
                    setTab={setActiveTab}
                    balance={walletBalance}
                    setBalance={setWalletBalance}
                    pickupRequested={pickupRequested}
                    setPickupRequested={setPickupRequested}
                    reportSuccess={reportSuccess}
                    setReportSuccess={setReportSuccess}
                  />
                )}
              </div>

              {/* iOS Bottom Home Indicator */}
              <div className="pointer-events-none absolute bottom-1.5 inset-x-0 z-40 flex justify-center">
                <div className="h-1 w-32 rounded-full bg-white/60 shadow-sm backdrop-blur-sm" />
              </div>

              {/* Screen Glass Specular Reflection Highlight */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[44px] opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 28%, transparent 55%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle / Spec Note */}
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Connected to Live Production: <code className="text-emerald-400 font-mono">smartwaste360-mobile.vercel.app</code></span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* High-Fidelity Client-Side Fallback Simulation of the Resident App           */
/* -------------------------------------------------------------------------- */

interface SimulationProps {
  tab: ResidentTab;
  setTab: (t: ResidentTab) => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  pickupRequested: boolean;
  setPickupRequested: (b: boolean) => void;
  reportSuccess: string | null;
  setReportSuccess: (s: string | null) => void;
}

function ResidentSimulationView({
  tab,
  setTab,
  balance,
  setBalance,
  pickupRequested,
  setPickupRequested,
  reportSuccess,
  setReportSuccess,
}: SimulationProps) {
  return (
    <div className="relative flex h-full w-full flex-col justify-between">
      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-20">
        {tab === "home" && (
          <div>
            {/* Header with LAWMA Logo */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <img src="/resident/smartwaste-icon.png" alt="LAWMA 360" className="size-6 rounded-md" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">LAWMA 360 Resident</p>
                  <p className="text-xs font-bold text-white">18 Olowu Street, Ikeja</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Partner</span>
              </div>
            </div>

            {/* Greeting */}
            <h2 className="mt-3.5 text-2xl font-bold tracking-tight text-white">Hello, Babatunde.</h2>
            <p className="text-xs text-white/70">GreenLine Collection is scheduled for your zone.</p>

            {/* Visual Hero Banner with Resident Image */}
            <div className="relative mt-3.5 overflow-hidden rounded-3xl border border-emerald-500/30 shadow-lg">
              <img
                src="/resident/collection.jpg"
                alt="LAWMA Collection in Action"
                className="h-32 w-full object-cover brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="rounded-full bg-emerald-500/30 w-max px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-300 uppercase">
                  {pickupRequested ? "Pickup Confirmed" : "Next Pickup"}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  {pickupRequested ? "Crew dispatched to Olowu Street" : "Scheduled Collection: Thursday 8–11 am"}
                </h3>
                <p className="text-[11px] text-white/80">
                  {pickupRequested
                    ? "Babatunde A. (Crew #04) is en route with verified RFID scanner."
                    : "Standard household pickup · ₦1,450 per bin"}
                </p>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => setPickupRequested(!pickupRequested)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-emerald-950 transition-transform active:scale-95 shadow-md hover:bg-emerald-400"
            >
              {pickupRequested ? (
                <>
                  <Check className="size-4" /> Pickup Confirmed (Tap to Cancel)
                </>
              ) : (
                <>
                  <Truck className="size-4" /> Request On-Demand Pickup Now
                </>
              )}
            </button>

            {/* Wallet Balance Card */}
            <div className="mt-3.5 rounded-3xl bg-neutral-900/90 p-4 border border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">Waste Wallet</p>
                  <p className="mt-0.5 text-2xl font-bold text-white">₦{balance.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setBalance((b) => b + 5000)}
                  className="flex items-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                >
                  <CreditCard className="size-3.5" />
                  <span>+ ₦5,000</span>
                </button>
              </div>
              <p className="mt-2 text-[10px] text-white/60">
                Auto-deducted only after crew takes GPS-stamped photo proof.
              </p>
            </div>

            {/* Smart Bin Status Card */}
            <div
              onClick={() => setTab("bins")}
              className="mt-3 rounded-3xl bg-neutral-900/90 p-3.5 border border-white/10 shadow-sm cursor-pointer hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Trash2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">1x Household Smart Bin</p>
                    <p className="text-[10px] text-white/60">RFID Tag: <code className="text-emerald-400 font-mono">LAW-IKJ-0148</code></p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Active
                </span>
              </div>
            </div>

            {/* Report an Issue Card */}
            <div
              onClick={() => setTab("report")}
              className="mt-3 flex cursor-pointer items-center justify-between rounded-3xl bg-neutral-900/70 p-3.5 border border-white/10 transition-colors hover:bg-neutral-800"
            >
              <div>
                <p className="text-xs font-bold text-white">Something not right?</p>
                <p className="text-[10px] text-white/60">Report missed pickup or damaged RFID tag.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center">
                Report <ChevronRight className="size-3.5" />
              </span>
            </div>
          </div>
        )}

        {tab === "bins" && (
          <div>
            <h2 className="text-xl font-bold text-white">Smart Bins</h2>
            <p className="text-xs text-white/70">Verified bins registered to your premise.</p>

            <div className="mt-4 space-y-3">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-neutral-900 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Standard 240L Wheelie Bin</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">Delivered</span>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <img src="/resident/delivery.jpg" alt="Bin delivery" className="size-14 rounded-xl object-cover" />
                  <div className="text-xs text-white/80">
                    <p className="font-semibold text-white">Zone IKJ-04 Registered</p>
                    <p className="text-[11px] text-white/60">Equipped with UHF RFID tag for automated zero-touch crew scanning.</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/60 border-t border-white/10 pt-2">
                  <span>Tag ID: <strong className="text-white font-mono">LAW-IKJ-0148</strong></span>
                  <span>Last scanned: Today 14:32</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Need an extra bin?</span>
                  <button className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-black">Request</button>
                </div>
                <p className="mt-1 text-xs text-white/60">Recycling bins and commercial sorting containers available for Lagos properties.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div>
            <h2 className="text-xl font-bold text-white">Collection Activity</h2>
            <p className="text-xs text-white/70">GPS-verified pickup receipts and crew timestamps.</p>

            <div className="mt-4 space-y-3">
              {[
                { date: "Today · 16:56", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450", gps: "6.6018° N, 3.3515° E" },
                { date: "Oct 28 · 10:14", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450", gps: "6.6017° N, 3.3514° E" },
                { date: "Oct 21 · 09:30", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450", gps: "6.6018° N, 3.3516° E" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.date}</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/70">{item.partner} · Verified tag scan</p>
                  <p className="text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                    <MapPin className="size-2.5 text-emerald-400" /> {item.gps}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-white/50 border-t border-white/10 pt-2">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="size-3" /> Stamped photo proof
                    </span>
                    <span className="font-semibold text-white">{item.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "wallet" && (
          <div>
            <h2 className="text-xl font-bold text-white">Waste Wallet</h2>
            <p className="text-xs text-white/70">Transparent billing, zero cash handoffs on the street.</p>

            <div className="mt-4 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0a231b] to-neutral-900 p-5 border border-emerald-500/30 shadow-md">
              <p className="text-[10px] font-bold text-emerald-300 tracking-wider">AVAILABLE BALANCE</p>
              <p className="mt-1 text-3xl font-extrabold text-white">₦{balance.toLocaleString()}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setBalance((b) => b + 2500)}
                  className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-colors"
                >
                  + ₦2,500
                </button>
                <button
                  onClick={() => setBalance((b) => b + 5000)}
                  className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-colors"
                >
                  + ₦5,000
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-white/80">Recent Transactions</p>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">Weekly Pickup Fee</p>
                  <p className="text-[10px] text-white/50">Nov 5 · GreenLine PSP</p>
                </div>
                <span className="font-bold text-rose-400">-₦1,450</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">Paystack Card Top Up</p>
                  <p className="text-[10px] text-white/50">Successful payment</p>
                </div>
                <span className="font-bold text-emerald-400">+₦10,000</span>
              </div>
            </div>
          </div>
        )}

        {tab === "report" && (
          <div>
            <h2 className="text-xl font-bold text-white">Report to LAWMA</h2>
            <p className="text-xs text-white/70">Direct escalation line to Lagos Waste Management Authority.</p>

            {reportSuccess && (
              <div className="mt-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold">Report Lodged Successfully</p>
                  <p className="text-[10px] text-emerald-300/80">{reportSuccess}</p>
                </div>
                <Check className="size-4 text-emerald-400" />
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {[
                { title: "Missed scheduled collection", desc: "Truck did not arrive during service window" },
                { title: "Damaged smart bin / RFID tag", desc: "Request tag replacement or repair" },
                { title: "Street spill or illegal dumping", desc: "Report neighborhood sanitation hazard" },
                { title: "Billing dispute or inquiry", desc: "Request fee audit from district officer" },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() =>
                    setReportSuccess(
                      `Ticket #${Math.floor(1000 + Math.random() * 9000)} generated. Assigned to Ikeja District Desk.`
                    )
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-neutral-900 p-3.5 text-left transition-colors hover:border-emerald-500/50 hover:bg-neutral-850"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="text-[10px] text-white/50">{item.desc}</p>
                  </div>
                  <ChevronRight className="size-4 text-white/50 flex-none" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Native iOS Bottom Tab Navigation Bar */}
      <nav
        className="absolute bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/90 px-3 py-2.5 backdrop-blur-md"
        aria-label="Resident App Navigation"
      >
        <button
          onClick={() => setTab("home")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            tab === "home" ? "text-emerald-400 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <Home className="size-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setTab("bins")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            tab === "bins" ? "text-emerald-400 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <Trash2 className="size-4" />
          <span>Bins</span>
        </button>
        <button
          onClick={() => setTab("activity")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            tab === "activity" ? "text-emerald-400 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <RotateCcw className="size-4" />
          <span>Activity</span>
        </button>
        <button
          onClick={() => setTab("wallet")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            tab === "wallet" ? "text-emerald-400 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <CreditCard className="size-4" />
          <span>Wallet</span>
        </button>
        <button
          onClick={() => setTab("report")}
          className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
            tab === "report" ? "text-emerald-400 font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          <ShieldAlert className="size-4" />
          <span>Report</span>
        </button>
      </nav>
    </div>
  );
}
