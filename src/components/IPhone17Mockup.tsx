import { useState, useRef } from "react";
import {
  BatteryFull,
  Check,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  RefreshCw,
  RotateCcw,
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

type ResidentTab = "home" | "bins" | "activity" | "wallet" | "report";

export function IPhone17Mockup({ initialRoute = "/", className = "" }: IPhone17MockupProps) {
  const [useIframe, setUseIframe] = useState(true);
  const [iframePath, setIframePath] = useState(initialRoute);
  const [iframeKey, setIframeKey] = useState(0);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [introSlide, setIntroSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<ResidentTab>("home");
  const [walletBalance, setWalletBalance] = useState(14500);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [clock, setClock] = useState("09:41");

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

  const introSlides = [
    {
      img: "/resident/before-dawn.jpg",
      eyebrow: "Before SmartWaste360",
      title: "No more waiting for the truck at dawn.",
      body: "Book a pickup that fits your day and see exactly when your crew is coming.",
    },
    {
      img: "/resident/delivery.jpg",
      eyebrow: "Smart Bins",
      title: "Bins delivered to your door.",
      body: "Your licensed PSP partner brings and services the right bins for your home.",
    },
    {
      img: "/resident/collection.jpg",
      eyebrow: "One line to LAWMA",
      title: "Report a problem in seconds.",
      body: "Describe it in your own words — we write it up clearly and send it to the right people.",
    },
  ];

  return (
    <div className={`iphone-presentation-wrapper flex flex-col items-center ${className}`}>
      {/* Presenter Quick Toolbar */}
      <div className="presenter-hud mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-xs backdrop-blur-md w-full max-w-[430px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Smartphone className="size-3.5" />
          <span>iPhone 17 Pro Mockup</span>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">Resident App</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseIframe(!useIframe)}
            className={`flex items-center gap-1 rounded-lg px-2 py-1 transition-colors ${
              useIframe ? "bg-primary text-primary-foreground font-semibold" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
            title="Toggle between Live Web App and Offline Replica"
          >
            <Globe className="size-3" />
            <span>{useIframe ? "Live" : "Simulation"}</span>
          </button>
          {useIframe && (
            <button
              onClick={reloadIframe}
              className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20"
              title="Reload resident view"
            >
              <RefreshCw className="size-3" />
            </button>
          )}
          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 p-1 text-white/80 hover:bg-white/20"
            title="Open standalone resident app in new tab"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Route Quick Jump Tabs for Presenters */}
      <div className="quick-jump-bar mb-4 flex w-full max-w-[430px] items-center justify-center gap-1.5 overflow-x-auto rounded-xl bg-white/5 p-1 text-[11px] text-white/70">
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
            background: "linear-gradient(145deg, #3a3b3e 0%, #1f2023 35%, #2c2d30 70%, #151618 100%)",
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
            <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-[#0c1411] text-white">
              {/* Dynamic Island */}
              <div
                onClick={() => setIslandExpanded(!islandExpanded)}
                className={`absolute left-1/2 top-3 z-40 -translate-x-1/2 cursor-pointer bg-black text-white transition-all duration-300 ease-out flex items-center justify-between px-3 ${
                  islandExpanded
                    ? "h-[54px] w-[340px] rounded-[28px] shadow-xl ring-1 ring-white/10"
                    : "h-[33px] w-[124px] rounded-full shadow-md"
                }`}
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
              <div className="h-[calc(100%-44px)] w-full overflow-y-auto overflow-x-hidden pt-1 pb-6">
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
                  /* High-Fidelity Deterministic Simulation */
                  <ResidentSimulationView
                    slideIndex={introSlide}
                    setSlideIndex={setIntroSlide}
                    slides={introSlides}
                    tab={activeTab}
                    setTab={setActiveTab}
                    balance={walletBalance}
                    setBalance={setWalletBalance}
                    pickupRequested={pickupRequested}
                    setPickupRequested={setPickupRequested}
                  />
                )}
              </div>

              {/* iOS Bottom Home Indicator */}
              <div className="pointer-events-none absolute bottom-2 inset-x-0 z-40 flex justify-center">
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
        <span className="size-1.5 rounded-full bg-emerald-500" />
        <span>Connected to Live Production: <code className="text-emerald-400">smartwaste360-mobile.vercel.app</code></span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* High-Fidelity Client-Side Fallback Simulation of the Resident App           */
/* -------------------------------------------------------------------------- */

interface SimulationProps {
  slideIndex: number;
  setSlideIndex: (i: number) => void;
  slides: { img: string; eyebrow: string; title: string; body: string }[];
  tab: ResidentTab;
  setTab: (t: ResidentTab) => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  pickupRequested: boolean;
  setPickupRequested: (b: boolean) => void;
}

function ResidentSimulationView({
  slideIndex,
  setSlideIndex,
  slides,
  tab,
  setTab,
  balance,
  setBalance,
  pickupRequested,
  setPickupRequested,
}: SimulationProps) {
  const currentSlide = slides[slideIndex] || slides[0];

  if (tab === "home") {
    return (
      <div className="px-5 py-2">
        {/* Residence Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">My Residence</p>
            <p className="text-sm font-bold text-white">18 Olowu Street, Ikeja</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Partner</span>
          </div>
        </div>

        {/* Greeting */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">Hello, Babatunde.</h2>
        <p className="text-xs text-white/70">GreenLine Collection is scheduled for your zone.</p>

        {/* Main Service Card */}
        <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#12382c] to-[#0a1f18] p-5 shadow-lg border border-emerald-500/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                {pickupRequested ? "Pickup Scheduled" : "Next Collection"}
              </span>
              <span className="text-xs text-white/80">Thursday, 8–11 am</span>
            </div>
            <h3 className="mt-3 text-xl font-bold leading-tight text-white">
              {pickupRequested ? "Crew dispatched to your street." : "Let’s make room for a cleaner day."}
            </h3>
            <p className="mt-1 text-xs text-white/80">
              {pickupRequested
                ? "Babatunde A. (Crew #04) is en route with verified RFID scanner."
                : "GreenLine Collection · ₦1,450 per standard household collection."}
            </p>
            <button
              onClick={() => setPickupRequested(!pickupRequested)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-emerald-950 transition-transform active:scale-95 shadow-md hover:bg-emerald-400"
            >
              {pickupRequested ? (
                <>
                  <Check className="size-4" /> Pickup Confirmed (Cancel)
                </>
              ) : (
                <>
                  <Truck className="size-4" /> Request On-Demand Pickup
                </>
              )}
            </button>
          </div>
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-40 rounded-full bg-emerald-500/20 blur-2xl" />
        </div>

        {/* Wallet Balance Card */}
        <div className="mt-4 rounded-3xl bg-neutral-900/90 p-4 border border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Demo Wallet Balance</p>
              <p className="mt-0.5 text-2xl font-bold text-white">₦{balance.toLocaleString()}</p>
            </div>
            <button
              onClick={() => setBalance((b) => b + 5000)}
              className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-white/20 transition-colors"
            >
              <CreditCard className="size-3.5" />
              <span>+ Top Up</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-white/60">
            Auto-deducted only after crew takes GPS-stamped photo proof.
          </p>
        </div>

        {/* Smart Bin Status Card */}
        <div className="mt-4 rounded-3xl bg-neutral-900/90 p-4 border border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Trash2 className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">1x Household Smart Bin</p>
                <p className="text-[11px] text-white/60">Tag: <code className="text-emerald-400 font-mono">LAW-IKJ-0148</code></p>
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
          className="mt-4 flex cursor-pointer items-center justify-between rounded-3xl bg-neutral-900/70 p-4 border border-white/10 transition-colors hover:bg-neutral-800"
        >
          <div>
            <p className="text-xs font-bold text-white">Something not right?</p>
            <p className="text-[11px] text-white/60">Report missed pickup or damaged bin tag.</p>
          </div>
          <span className="text-xs font-bold text-amber-400 flex items-center">
            Report <ChevronRight className="size-3.5" />
          </span>
        </div>
      </div>
    );
  }

  if (tab === "bins") {
    return (
      <div className="px-5 py-2">
        <h2 className="text-xl font-bold text-white">Smart Bins</h2>
        <p className="text-xs text-white/70">Verified bins registered to your premise.</p>

        <div className="mt-4 space-y-3">
          <div className="rounded-3xl border border-emerald-500/30 bg-neutral-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">Standard 240L Wheelie Bin</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">Delivered</span>
            </div>
            <p className="mt-2 text-xs text-white/80">Equipped with UHF RFID tag for automated zero-touch crew scanning.</p>
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
            <p className="mt-1 text-xs text-white/60">Recycling bins and commercial sorting containers available.</p>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "activity") {
    return (
      <div className="px-5 py-2">
        <h2 className="text-xl font-bold text-white">Collection Activity</h2>
        <p className="text-xs text-white/70">GPS-verified pickup receipts and crew timestamps.</p>

        <div className="mt-4 space-y-3">
          {[
            { date: "Today · 16:56", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450" },
            { date: "Oct 28 · 10:14", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450" },
            { date: "Oct 21 · 09:30", status: "Collected", partner: "GreenLine Crew #04", proof: true, fee: "₦1,450" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.date}</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70">{item.partner} · Photo proof stamped on-chain</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/50 border-t border-white/10 pt-2">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="size-3" /> Verified proof photo
                </span>
                <span className="font-semibold text-white">{item.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "wallet") {
    return (
      <div className="px-5 py-2">
        <h2 className="text-xl font-bold text-white">Waste Wallet</h2>
        <p className="text-xs text-white/70">Transparent billing, zero cash handoffs on the street.</p>

        <div className="mt-4 rounded-3xl bg-gradient-to-br from-emerald-900/60 to-neutral-900 p-5 border border-emerald-500/30">
          <p className="text-xs text-emerald-300 font-medium">AVAILABLE BALANCE</p>
          <p className="mt-1 text-3xl font-bold text-white">₦{balance.toLocaleString()}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setBalance((b) => b + 2500)}
              className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-black"
            >
              + ₦2,500
            </button>
            <button
              onClick={() => setBalance((b) => b + 5000)}
              className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-black"
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
              <p className="text-[10px] text-white/50">Nov 5 · GreenLine</p>
            </div>
            <span className="font-bold text-rose-400">-₦1,450</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-3 flex justify-between items-center text-xs">
            <div>
              <p className="font-semibold text-white">Wallet Top Up</p>
              <p className="text-[10px] text-white/50">Paystack / Bank Transfer</p>
            </div>
            <span className="font-bold text-emerald-400">+₦10,000</span>
          </div>
        </div>
      </div>
    );
  }

  // Report tab
  return (
    <div className="px-5 py-2">
      <h2 className="text-xl font-bold text-white">Report to LAWMA</h2>
      <p className="text-xs text-white/70">Direct escalation line to Lagos Waste Management Authority.</p>

      <div className="mt-4 space-y-3">
        {["Missed collection", "Damaged smart bin / RFID tag", "Spill on street", "Overbilling"].map((reason) => (
          <button
            key={reason}
            onClick={() => alert(`Report filed for: ${reason}. Reference #LAW-REP-${Math.floor(1000 + Math.random() * 9000)} generated.`)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-neutral-900 p-3.5 text-left text-xs font-semibold text-white hover:border-emerald-500/50"
          >
            <span>{reason}</span>
            <ChevronRight className="size-4 text-white/50" />
          </button>
        ))}
      </div>
    </div>
  );
}
