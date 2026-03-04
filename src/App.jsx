// ============================================================
//  ZEN RING — Product Landing Page
//  Stack: React + Framer Motion + Tailwind CSS
//
//  Page structure:
//    1. <Navbar />              — Top navigation bar
//    2. <HeroSection />         — Scroll-animated 3D ring reveal
//    3. <SpecSection />         — SVG pointer callouts on ring anatomy
//    4. <FeaturesSection />     — Bento grid of health feature cards
//    5. <ColorVariantSection /> — Scroll-driven ring color swap
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate, useScroll, useTransform, useInView } from "framer-motion";

// ---------- Asset imports ----------
import RingImg from "./assets/Images/Ring image.png";
import Shell from "./assets/Images/Ring Shell.png";
import RingBlack from "./assets/Images/Ring Black.png";
import RingSilver from "./assets/Images/Ring Silver.png"
import RingGold from "./assets/Images/Ring Gold.png"
import RingCharging from "./assets/Images/Ring Charging.png"

import AT1 from "./assets/Images/AT1.png";
import AT2 from "./assets/Images/AT2.png";
import AT3 from "./assets/Images/AT3.png";
import SleepMonitoring from "./assets/Images/Sleep Monitoring.png";
import HepticAlarm from "./assets/Images/Heptic Alarm.png";
import HeartIcon from "./assets/Images/Heart Icon.png";
import TempBar from "./assets/Images/Temp Icon.png";
import BatteryIcon from "./assets/Images/Battery Icon.png";


import Logo from "./assets/Images/Logo.png"
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


// ============================================================
//  NAVBAR
// ============================================================

function Navbar() {
  return (
    <div className="py-2 px-4 w-full grid grid-cols-2">

      {/* Brand wordmark */}
      <div className="font-geist text-prtext text-[clamp(2rem,2.2vw,4rem)] font-medium underline underline-offset-8 decoration-white">
        ZEN RING
      </div>

      {/* Navigation links */}
      <div className="flex justify-end gap-4 text-sectext text-[clamp(1rem,1vw,1rem)] items-center">
        <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">DESIGN</button>
        <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">PERFORMANCE</button>
        <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">MATERIALS</button>
        <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">ORDER</button>
      </div>

    </div>
  );
}


// ============================================================
//  TYPING ANIMATION  (hero sub-headline)
//  Renders one character at a time with a blinking cursor.
// ============================================================

function TypingText() {
  const fullText =
    "A medical-grade laboratory, refined into a single band of Grade 5 Titanium. No screens. No distractions. Just you, optimized.";

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50); // ms per character — lower = faster

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <p className="text-sectext text-center font-gmono w-[57%] text-[1rem] mt-3">
      {text}
      <span className="animate-blink">|</span>
    </p>
  );
}


// ============================================================
//  SVG POINTER CALLOUT
//  Reusable component for the ring anatomy labels.
//
//  Props:
//    viewBox   — SVG coordinate space (controls label positioning)
//    label     — text displayed at the start of the line
//    textX/Y   — label anchor position in SVG units
//    path      — SVG path `d` string for the connector line
//    textOpacity — Framer motion value (fades in on scroll)
//    lineDraw    — Framer motion value (draws line on scroll)
// ============================================================

function SpecPointer({ viewBox, label, textX, textY, path, textOpacity, lineDraw }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={viewBox}
    >
      {/* Label text */}
      <motion.text
        x={textX}
        y={textY}
        fill="white"
        fontSize="18"
        className="font-gmono"
        textAnchor="end"
        dominantBaseline="middle"
        style={{ opacity: textOpacity }}
      >
        {label}
      </motion.text>

      {/* Connector line — drawn via pathLength on scroll */}
      <motion.path
        d={path}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
        fill="transparent"
        strokeLinecap="square"
        style={{ pathLength: lineDraw }}
      />
    </svg>
  );
}


// ============================================================
//  HERO SECTION
//  Scroll-animated 3D ring with floating shell element.
//  Uses a single scroll container (containerRef) that is
//  200vh tall so the sticky ring animates as you scroll.
// ============================================================

function HeroSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- Ring motion values ---
  const y = useTransform(scrollYProgress, [0, 0.9], [0, 600]);
  const rotateY = useTransform(scrollYProgress, [0.3, 0.6], [0, 180]);
  const scale = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.8]);
  const z = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 200, 0]);
  const rotateX = useTransform(scrollYProgress, [0.3, 0.6], [0, 20]);

  // --- Shell (outer casing) slides right and fades out ---
  const shellX = useTransform(scrollYProgress, [0.2, 1], [0, 400]);
  const shellRotate = useTransform(scrollYProgress, [0.2, 1], [0, -25]);
  const shellOpacity = useTransform(scrollYProgress, [0.2, 0.8], [1, 0]);
  const shellZ = useTransform(scrollYProgress, [0.2, 1], [1, 0]);

  // --- Spec callout lines draw in, labels fade in ---
  const lineDraw = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);

  // Spec pointer data — each entry maps to one <SpecPointer />
  const specPointers = [
    {
      id: "bio-sensors",
      viewBox: "0 0 1260 600",
      label: "Bio-Reflective Sensors",
      textX: "370", textY: "155",
      path: "M380 160 L560 160 L610 180",
    },
    {
      id: "titanium",
      viewBox: "0 0 10 600",
      label: "Grade 5 Titanium",
      textX: "580", textY: "155",
      path: "M400 160 L160 160 L110 190",
    },
    {
      id: "battery",
      viewBox: "0 0 10 600",
      label: "High-Density Battery",
      textX: "630", textY: "400",
      path: "M400 400 L160 400 L110 360",
    },
    {
      id: "processor",
      viewBox: "0 0 1260 600",
      label: "Neural-Sensing Processor",
      textX: "300", textY: "460",
      path: "M310 460 L560 460 L610 410",
    },
  ];

  return (
    <div ref={containerRef} className="h-[200vh]">

      {/* --- Hero visual + headline --- */}
      <section className="flex flex-col items-center">

        <div className="perspective-[1000px]">

          {/* Main ring — rotates & scales on scroll */}
          <motion.img
            src={RingImg}
            style={{ y, rotateY, rotateX, scale, z }}
            className="h-80 relative z-10 ring-3D"
          />

          {/* Shell casing — slides out on scroll */}
          <motion.img
            src={Shell}
            style={{ y, x: shellX, rotateZ: shellRotate, opacity: shellOpacity, z: shellZ }}
            className="h-80 z-10 ring-3D absolute top-16 left-[37vw]"
          />

          {/* Glow shadow beneath ring */}
          <div
            className="h-[15px] w-[300px] blur-sm animate-ShadowGoUp opacity-0"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(34,197,94,0.8)  0%,
                rgba(34,197,94,0.4) 40%,
                rgba(34,197,94,0.1) 70%,
                transparent         100%)`,
            }}
          />

        </div>

        {/* Headline + sub-copy + CTA */}
        <div className="text-prtext font-geist text-[clamp(3rem,2vw,4rem)] mt-3">
          'The sound of silence. The pulse of life.'
        </div>

        <TypingText />

        <button className="bg-blue-800 rounded-full text-ctalight p-2 px-3 font-geist border-2 border-ctalight mt-4">
          RESERVE YOUR AURA
        </button>

      </section>

      {/* --- Spec callout overlay (draws in at bottom of scroll range) --- */}
      <div>
        <div className="relative h-[80vh]">

          {specPointers.map((pointer) => (
            <SpecPointer
              key={pointer.id}
              viewBox={pointer.viewBox}
              label={pointer.label}
              textX={pointer.textX}
              textY={pointer.textY}
              path={pointer.path}
              textOpacity={textOpacity}
              lineDraw={lineDraw}
            />
          ))}

        </div>

        {/* Section end tagline */}
        <div className="text-white font-geist italic justify-self-center text-[44px]">
          Engineering the Invisible.
        </div>
      </div>

    </div>
  );
}


// ============================================================
//  RECOVERY SCORE CARD
//  Counts up to 94 when the card scrolls into view.
// ============================================================

function RecoveryScoreCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, 94, { duration: 2 });
    }
  }, [isInView]);

  return (
    <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-2 hover:scale-110 transition-all 1s ease-in-out">
      <div className="font-gmono">RECOVERY SCORE</div>
      <motion.div ref={ref} className="text-[4rem] font-gmono justify-self-center">
        {rounded}
      </motion.div>
    </div>
  );
}


// ============================================================
//  FEATURES SECTION  ("The List is Endless.")
//
//  Layout technique: Two identical bento grids are stacked
//  on top of each other via negative margin (-mt-[465px]).
//    • Bottom layer  — blurred, low-opacity ghost cards
//                      (creates a frosted depth effect)
//    • Top layer     — real glass-morphism feature cards
// ============================================================

function FeaturesSection() {
  return (
    <section className="w-[100%] flex flex-col items-center my-10 gap-6">

      <div className="text-prtext font-geist text-[clamp(2.6rem,2vw,3rem)] mb-10 italic">
        "The List is Endless."
      </div>

      {/* --- Ghost / depth layer (blurred, decorative) --- */}
      <div className="w-[90%] h-[75vh] p-2 grid grid-cols-1 md:grid-rows-3 md:grid-cols-6 gap-6 text-prtext opacity-20">
        <div className="bento hover:scale-125 blur-md rounded-2xl md:row-span-3 md:col-span-2" />
        <div className="bento hover:scale-125 blur-md rounded-2xl" />
        <div className="bento hover:scale-125 blur-md rounded-2xl" />
        <div className="bento hover:scale-125 blur-md rounded-2xl md:col-span-2" />
        <div className="bento hover:scale-125 blur-md rounded-2xl md:col-span-2 md:row-span-2" />
        <div className="bento hover:scale-125 blur-md rounded-2xl md:row-span-2" />
        <div className="bento hover:scale-125 blur-md rounded-2xl md:row-span-2" />
      </div>

      {/* --- Real feature card layer (overlaid via negative margin) --- */}
      <div className="w-[90%] h-[75vh] p-2 grid grid-cols-1 md:grid-rows-3 md:grid-cols-6 gap-6 text-prtext -mt-[465px]">

        {/* CARD 1 — Activity Monitoring (spans 3 rows) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl md:row-span-3 md:col-span-2 p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">ACTIVITY MONITORING</div>

          <div className="flex gap-7 font-gmono text-[12px] text-center w-[83%] justify-self-center mt-10">
            <span><img src={AT1} alt="" /> Activity Intensity</span>
            <span><img src={AT2} alt="" /> SPO2 Levels</span>
            <span><img src={AT3} alt="" /> Calories Burnt</span>
          </div>

          <ul className="mt-14 font-gmono text-[14px] space-y-3 list-disc pl-6">
            <li>Time in high-intensity zones vs. light movement.</li>
            <li>Real-time respiratory saturation monitoring.</li>
            <li>Total active and resting energy expenditure.</li>
          </ul>
        </div>

        {/* CARD 2 — Recovery Score (animated counter) */}
        <RecoveryScoreCard />

        {/* CARD 3 — Vagal Tone (HRV icon) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">VAGAL TONE</div>
          <img src={HeartIcon} className="h-[60%] justify-self-center mt-3" alt="" />
        </div>

        {/* CARD 4 — Haptic Alarm (full-bleed background image) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl md:col-span-2 p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">HEPTIC ALARM</div>
          <span>
            <img
              src={HepticAlarm}
              className="absolute top-0 left-0 rounded-2xl h-[100%] w-[100%] -z-10"
              alt=""
            />
          </span>
        </div>

        {/* CARD 5 — Sleep Quality (spans 2 rows) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl md:col-span-2 md:row-span-2 p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">SLEEP QUALITY MONITORING</div>
          <span className="font-gmono justify-self-center flex flex-col items-center mt-4 gap-6">
            <img src={SleepMonitoring} className="h-[60%]" alt="" />
            Real-time health insights.
          </span>
        </div>

        {/* CARD 6 — Body Temperature (spans 2 rows) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl md:row-span-2 p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">BODY TEMPREATURE</div>
          <img src={TempBar} className="h-[60%] justify-self-center" alt="" />
          <div className="font-gmono text-[3rem]">37°</div>
        </div>

        {/* CARD 7 — Battery Life (spans 2 rows) */}
        <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl md:row-span-2 p-2 hover:scale-110 transition-all 1s ease-in-out">
          <div className="font-gmono">LONG BATTERY LIFE</div>
          <img src={BatteryIcon} className="h-[50%] justify-self-center" alt="" />
          <div className="flex font-gmono items-center gap-3">
            <span className="text-[3rem]">8</span>
            Days Long Lasting
          </div>
        </div>

      </div>
    </section>
  );
}


// ============================================================
//  COLOR VARIANT SECTION — updated animation scheme
//
//  Black  → exits LEFT with rotation
//  Silver → enters from BOTTOM with rotation, straightens,
//           then exits LEFT with rotation
//  Gold   → enters from BOTTOM with rotation, straightens,
//           then holds
//
//  Rotation direction:
//    Entry  — tilts from  15° → 0°  (rights itself as it rises)
//    Exit   — tilts from   0° → -15° (tips away as it leaves)
//
//  Visibility fix: Silver and Gold start at y:800 (off-screen)
//  so they are never visible before their turn.
//
//  Scroll timeline:
//    0.00 – 0.20  Black  visible
//    0.20 – 0.40  Black  exits left+rotates  / Silver rises in + unrotates
//    0.40 – 0.60  Silver visible
//    0.60 – 0.80  Silver exits left+rotates  / Gold rises in + unrotates
//    0.80 – 1.00  Gold   visible
// ============================================================

function ColorVariantSection() {

  const ringVariants = [
    {
      id: "black",
      src: RingBlack,
      heading: "Bold. Silent. Absolute.",
      subtext: "Deep, obsidian PVD coating. Designed for those who prefer power without the noise.",
    },
    {
      id: "silver",
      src: RingSilver,
      heading: "Pure Resilience.",
      subtext: "Raw, aerospace-grade finish. Industrial strength meets a refined, matte edge.",
    },
    {
      id: "gold",
      src: RingGold,
      heading: "18K Sophistication.",
      subtext: "High-luster elegance. A premium gold finish designed to endure the everyday.",
    },
  ];

  const colorRef = useRef(null);

  const { scrollYProgress: progress } = useScroll({
    target: colorRef,
    offset: ["start start", "end end"],
  });

  // --- Black — exits left, rotates clockwise (0 → 45) starting the instant it moves ---
  const xBlack = useTransform(progress, [0.20, 0.40], [0, -800]);
  const yBlack = useTransform(progress, [0, 1], [0, 0]);
  const rotateZBlack = useTransform(progress, [0.20, 0.40], [0, 70]);
  const opacityBlack = useTransform(progress, [0.20, 0.35], [1, 0]);

  // --- Silver — enters rotating counter-clockwise (-45 → 0), holds flat,
  //              then exits rotating clockwise (0 → 45). Opposite dirs on in vs out. ---
  const xSilver = useTransform(progress, [0.60, 0.80], [0, -800]);
  const ySilver = useTransform(progress, [0.20, 0.40], [800, 0]);
  const rotateZSilver = useTransform(progress, [0.20, 0.40, 0.60, 0.80], [-70, 0, 0, 70]);
  const opacitySilver = useTransform(progress, [0.33, 0.46, 0.60, 0.73], [0, 1, 1, 0]);

  // --- Gold — enters rotating counter-clockwise (-45 → 0), then holds upright ---
  const xGold = useTransform(progress, [0, 1], [0, 0]);
  const yGold = useTransform(progress, [0.60, 0.80], [800, 0]);
  const rotateZGold = useTransform(progress, [0.60, 0.80], [-70, 0]);
  const opacityGold = useTransform(progress, [0.73, 0.86], [0, 1]);

  // Bundled so the map below stays clean
  // NOTE: must use rotateZ (not rotate) when combining with x/y in Framer Motion style prop
  const ringMotionValues = [
    { x: xBlack, y: yBlack, rotateZ: rotateZBlack, opacity: opacityBlack },
    { x: xSilver, y: ySilver, rotateZ: rotateZSilver, opacity: opacitySilver },
    { x: xGold, y: yGold, rotateZ: rotateZGold, opacity: opacityGold },
  ];

  return (
    <section ref={colorRef} className="h-[300vh] relative">

      <div className="sticky top-0 h-screen grid grid-cols-2 items-center overflow-hidden">

        {/* Ring Column — all 3 stacked absolutely, each driven by its own motion values */}
        <div className="relative justify-self-center w-full flex flex-col justify-center">
          {ringVariants.map((variant, i) => (
            <motion.img
              key={variant.id}
              src={variant.src}
              style={{
                x: ringMotionValues[i].x,
                y: ringMotionValues[i].y,
                rotateZ: ringMotionValues[i].rotateZ,
                opacity: ringMotionValues[i].opacity,
              }}
              className="absolute"
            />
          ))}
        </div>

        {/* Text Column — headings + subtexts, each fades with its ring */}
        <div className="relative text-right p-4 h-40">
          {ringVariants.map((variant, i) => (
            <motion.div
              key={variant.id}
              style={{ opacity: ringMotionValues[i].opacity }}
              className="absolute right-4 top-0 flex flex-col items-end gap-2"
            >
              <span className="font-geist text-prtext text-[44px] font-semibold leading-tight">
                {variant.heading}
              </span>

              {variant.subtext && (
                <span className="font-gmono text-sectext text-[14px] w-[60%] text-right">
                  {variant.subtext}
                </span>
              )}


              <button className="bg-blue-800 rounded-full text-ctalight p-2 px-3 font-geist border-2 border-ctalight mt-4">
                RESERVE YOUR AURA
              </button>
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}

function ComparisionTable() {

  // ============================================================
  //  COMPARISON TABLE — Zen Ring vs Smartwatches
  //  Matches the dark table design from the screenshot.
  //  Zen Ring values are bold, Smartwatches values are normal weight.
  // ============================================================

  const comparisonData = [
    {
      feature: "Battery Life",
      zenRing: "8+ Days",
      smartwatch: "18–24 Hours",
    },
    {
      feature: "Sleep Comfort",
      zenRing: "Zero-Bulk Design",
      smartwatch: "Heavy & Distracting",
    },
    {
      feature: "Focus",
      zenRing: "Screen-free Living",
      smartwatch: "Constant Notifications",
    },
    {
      feature: "Durability",
      zenRing: "Grade 5 Titanium",
      smartwatch: "Fragile Glass Screens",
    },
    {
      feature: "Form Factor",
      zenRing: "Weightless (2.4g)",
      smartwatch: "Bulky & Heavy",
    },
  ];

  return (

    <section className="w-full flex flex-col items-center my-20 px-10">

      <div className="text-prtext font-geist text-[52px] font-bold mb-12 drop-shadow-[0_10px_12px_rgba(29,78,216,0.3)] ">The Future is <span className="italic font-gmono font-light">Screenless.</span></div>

      <table className="w-[90%] border-collapse">

        {/* Header row */}
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left font-geist text-sectext font-bold text-[24px] py-4 w-[33%]">Feature</th>
            <th className="text-left font-geist text-sectext font-bold text-[24px] py-4 w-[33%]">Zen Ring</th>
            <th className="text-left font-geist text-sectext font-bold text-[24px] py-4 w-[33%]">Smartwatches</th>
          </tr>
        </thead>

        {/* Data rows */}
        <tbody>
          {comparisonData.map((row) => (
            <tr key={row.feature} className="border-b border-white/10">

              {/* Feature name — always bold */}
              <td className="font-geist text-prtext font-bold py-5 text-[18px]">
                {row.feature}
              </td>

              {/* Zen Ring value — bold, highlighted */}
              <td className="font-gmono text-prtext font-bold py-5 text-[15px]">
                {row.zenRing}
              </td>

              {/* Smartwatch value — normal weight, dimmed */}
              <td className="font-gmono text-sectext font-normal py-5 text-[15px]">
                {row.smartwatch}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </section>

  );
}

function CTA() {

  const ringVariants = [
    {
      id: "black",
      src: RingBlack,
      price: "$229",
      color: "Black"
    },
    {
      id: "silver",
      src: RingSilver,
      price: "$229",
      color: "Silver"
    },
    {
      id: "gold",
      src: RingGold,
      price: "$229",
      color: "Gold"
    },
  ];

  const [selectedRing, setSelectedRing] = useState(ringVariants[0])


  return (
    <>
      {/* SECTION 1 */}
      <div
        className="h-[100vh] w-auto mb-16 grid grid-cols-2">

        {/* COL 1 */}
        <div className="pl-10 flex justify-center items-center">
          <img src={RingCharging} className="h-[90%] w-auto" />
        </div>

        {/* COL 2 */}
        <div className=" items-start pt-32">
          <span className="text-prtext font-geist text-[clamp(3rem,3vw,4rem)] mt-3 text-right pr-10 ">Ready to Find Your Zen?</span>
          <p className="text-sectext font-gmono text-[26px] text-right mb-4 w-[85%]">Join 50,000+ early adopters who traded distractions for data.</p>
        </div>

      </div>

      {/* SECTION 2 */}

      <div className="grid grid-cols-1 mb-20">
        <div className="flex flex-col items-center justify-center">
          <img src={selectedRing.src} alt="" className="h-80" />
          <div
            className="h-[15px] w-[300px] blur-sm opacity-20"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(34,197,94,0.8)  0%,
                rgba(34,197,94,0.4) 40%,
                rgba(34,197,94,0.1) 70%,
                transparent         100%)`,
            }}
          />
          <div className="text-prtext font-geist font-bold text-[44px]">Zen Ring</div>
          <div className="font-gmono text-sectext tracking-wider">Master Your Inner Metric.</div>



          <div className="space-x-12 mt-4">
            {ringVariants.map((ring) => (
              <button
                key={ring.id}
                onClick={() => setSelectedRing(ring)}
                className={`text-prtext border px-8 py-2 rounded-full ${   selectedRing.id === ring.id
            ? "bg-blue-900 text-white border-blue-900" : ""}`}
              >
                {ring.color}
              </button>
            ))}
          </div>


          <div className="flex gap-4 items-center">
            <span className="text-prtext font-geist mt-4 text-[48px]">{selectedRing.price}</span>

            <button className="bg-blue-800 rounded-full text-ctalight h-[50px] px-9 font-geist border-2 border-ctalight mt-4">
              Order
          </button>

          </div>

      </div>

      </div>

    </>

  );
}

function Footer(){
  return(
    <div className="flex flex-col items-center">
      <div className="h-[1px] bg-gray-500/20 w-full"></div>
      <img src={Logo} alt="" className="h-20 mt-10"/>
      <div className="font-geist text-prtext text-[2rem]">ZEN RING</div>
      <div className="font-gmono text-sectext tracking-wider">Master Your Inner Metric.</div>
        <div className="flex gap-8 text-sectext text-[24px] mt-3">  <FaInstagram/> <FaXTwitter/> <FaFacebookF/></div>
        <div className="flex gap-8 text-sectext text-[15px] font-gmono mt-1">  @ZenRing.Official</div>
    </div>

    

  );
}

// ============================================================
//  ROOT  — Assembles all sections
// ============================================================

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ColorVariantSection />
      <ComparisionTable />
      <CTA />
      <Footer />
    </>
  );
}

export default App;







































































// RESPONSIVE CODE = >>>>>











// ============================================================
//  ZEN RING — Product Landing Page
//  Stack: React + Framer Motion + Tailwind CSS
//
//  Responsiveness strategy:
//    • clamp() on all font sizes — fluid scaling within device types
//    • Tailwind breakpoints (md:) for layout structure shifts
//    • Bento grid: desktop uses double-layer ghost trick,
//      mobile uses simple stacked cards (no negative margin)
//    • SVG spec pointers hidden on mobile (coordinate-based)
//    • Shell ring image hidden on mobile (left-[37vw] breaks small)
//    • All fixed px sizes converted to clamp() or responsive classes
// ============================================================

// import { useState, useEffect, useRef } from "react";
// import { motion, useMotionValue, animate, useScroll, useTransform, useInView } from "framer-motion";

// ---------- Asset imports ----------
// import RingImg         from "./assets/Images/Ring image.png";
// import Shell           from "./assets/Images/Ring Shell.png";
// import RingBlack       from "./assets/Images/Ring Black.png";
// import RingSilver      from "./assets/Images/Ring Silver.png";
// import RingGold        from "./assets/Images/Ring Gold.png";
// import RingCharging    from "./assets/Images/Ring Charging.png";

// import AT1             from "./assets/Images/AT1.png";
// import AT2             from "./assets/Images/AT2.png";
// import AT3             from "./assets/Images/AT3.png";
// import SleepMonitoring from "./assets/Images/Sleep Monitoring.png";
// import HepticAlarm     from "./assets/Images/Heptic Alarm.png";
// import HeartIcon       from "./assets/Images/Heart Icon.png";
// import TempBar         from "./assets/Images/Temp Icon.png";
// import BatteryIcon     from "./assets/Images/Battery Icon.png";
// import Logo            from "./assets/Images/Logo.png";

// import { FaInstagram, FaFacebookF } from "react-icons/fa";
// import { FaXTwitter } from "react-icons/fa6";


// // ============================================================
// //  NAVBAR
// //  Mobile: hamburger toggles link dropdown
// //  Desktop: inline links
// // ============================================================

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="py-2 px-4 w-full">

//       <div className="grid grid-cols-2">

//         {/* Brand wordmark */}
//         <div className="font-geist text-prtext text-[clamp(1.5rem,2.2vw,4rem)] font-medium underline underline-offset-8 decoration-white">
//           ZEN RING
//         </div>

//         {/* Desktop links */}
//         <div className="hidden md:flex justify-end gap-4 text-sectext text-[clamp(0.75rem,1vw,1rem)] items-center">
//           <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">DESIGN</button>
//           <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">PERFORMANCE</button>
//           <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">MATERIALS</button>
//           <button className="font-gmono hover:bg-blue-800 px-2 focus:outline-none">ORDER</button>
//         </div>

//         {/* Hamburger — mobile only */}
//         <div className="flex md:hidden justify-end items-center">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-prtext font-gmono text-[1.4rem] focus:outline-none"
//           >
//             {menuOpen ? "✕" : "☰"}
//           </button>
//         </div>

//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="flex flex-col gap-3 mt-3 md:hidden text-sectext font-gmono text-[1rem] pb-3 border-b border-white/10">
//           <button className="text-left hover:text-prtext focus:outline-none">DESIGN</button>
//           <button className="text-left hover:text-prtext focus:outline-none">PERFORMANCE</button>
//           <button className="text-left hover:text-prtext focus:outline-none">MATERIALS</button>
//           <button className="text-left hover:text-prtext focus:outline-none">ORDER</button>
//         </div>
//       )}

//     </div>
//   );
// }


// // ============================================================
// //  TYPING ANIMATION — hero sub-headline
// // ============================================================

// function TypingText() {
//   const fullText =
//     "A medical-grade laboratory, refined into a single band of Grade 5 Titanium. No screens. No distractions. Just you, optimized.";

//   const [text, setText]   = useState("");
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (index < fullText.length) {
//       const timeout = setTimeout(() => {
//         setText((prev) => prev + fullText[index]);
//         setIndex((prev) => prev + 1);
//       }, 50);
//       return () => clearTimeout(timeout);
//     }
//   }, [index]);

//   return (
//     <p className="text-sectext text-center font-gmono w-[90%] md:w-[57%] text-[clamp(0.7rem,1.2vw,1rem)] mt-3">
//       {text}
//       <span className="animate-blink">|</span>
//     </p>
//   );
// }


// // ============================================================
// //  SVG POINTER CALLOUT
// //  Hidden on mobile — SVG coordinates are absolute viewport
// //  values that can't scale to small screens correctly.
// // ============================================================

// function SpecPointer({ viewBox, label, textX, textY, path, textOpacity, lineDraw }) {
//   return (
//     <svg
//       className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
//       viewBox={viewBox}
//     >
//       <motion.text
//         x={textX} y={textY}
//         fill="white" fontSize="18"
//         className="font-gmono"
//         textAnchor="end"
//         dominantBaseline="middle"
//         style={{ opacity: textOpacity }}
//       >
//         {label}
//       </motion.text>

//       <motion.path
//         d={path}
//         stroke="rgba(255,255,255,0.6)"
//         strokeWidth="1"
//         fill="transparent"
//         strokeLinecap="square"
//         style={{ pathLength: lineDraw }}
//       />
//     </svg>
//   );
// }


// // ============================================================
// //  HERO SECTION
// // ============================================================

// function HeroSection() {
//   const containerRef = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   // Ring transforms
//   const y       = useTransform(scrollYProgress, [0, 0.9],        [0, 600]);
//   const rotateY = useTransform(scrollYProgress, [0.3, 0.6],      [0, 180]);
//   const scale   = useTransform(scrollYProgress, [0.2, 0.6],      [1, 0.8]);
//   const z       = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 200, 0]);
//   const rotateX = useTransform(scrollYProgress, [0.3, 0.6],      [0, 20]);

//   // Shell slides out
//   const shellX       = useTransform(scrollYProgress, [0.2, 1],   [0, 400]);
//   const shellRotate  = useTransform(scrollYProgress, [0.2, 1],   [0, -25]);
//   const shellOpacity = useTransform(scrollYProgress, [0.2, 0.8], [1, 0]);
//   const shellZ       = useTransform(scrollYProgress, [0.2, 1],   [1, 0]);

//   // Spec callout draw-in
//   const lineDraw    = useTransform(scrollYProgress, [0.75, 0.9],  [0, 1]);
//   const textOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);

//   const specPointers = [
//     { id: "bio-sensors", viewBox: "0 0 1260 600", label: "Bio-Reflective Sensors",   textX: "370", textY: "155", path: "M380 160 L560 160 L610 180" },
//     { id: "titanium",    viewBox: "0 0 10 600",   label: "Grade 5 Titanium",         textX: "580", textY: "155", path: "M400 160 L160 160 L110 190" },
//     { id: "battery",     viewBox: "0 0 10 600",   label: "High-Density Battery",     textX: "630", textY: "400", path: "M400 400 L160 400 L110 360" },
//     { id: "processor",   viewBox: "0 0 1260 600", label: "Neural-Sensing Processor", textX: "300", textY: "460", path: "M310 460 L560 460 L610 410" },
//   ];

//   return (
//     <div ref={containerRef} className="h-[200vh]">

//       <section className="flex flex-col items-center">

//         <div className="perspective-[1000px]">

//           {/* Main ring — smaller on mobile */}
//           <motion.img
//             src={RingImg}
//             style={{ y, rotateY, rotateX, scale, z }}
//             className="h-48 md:h-80 relative z-10 ring-3D"
//           />

//           {/* Shell — hidden on mobile, left-[37vw] breaks on small screens */}
//           <motion.img
//             src={Shell}
//             style={{ y, x: shellX, rotateZ: shellRotate, opacity: shellOpacity, z: shellZ }}
//             className="hidden md:block h-80 z-10 ring-3D absolute top-16 left-[37vw]"
//           />

//           {/* Glow shadow */}
//           <div
//             className="h-[15px] w-[200px] md:w-[300px] blur-sm animate-ShadowGoUp opacity-0"
//             style={{
//               background: `radial-gradient(ellipse at center,
//                 rgba(34,197,94,0.8)  0%,
//                 rgba(34,197,94,0.4) 40%,
//                 rgba(34,197,94,0.1) 70%,
//                 transparent         100%)`,
//             }}
//           />

//         </div>

//         {/* Headline */}
//         <div className="text-prtext font-geist text-[clamp(1.2rem,2.5vw,4rem)] mt-3 text-center px-4">
//           'The sound of silence. The pulse of life.'
//         </div>

//         <TypingText />

//         <button className="bg-blue-800 rounded-full text-ctalight p-2 px-3 font-geist border-2 border-ctalight mt-4 text-[clamp(0.75rem,1vw,1rem)]">
//           RESERVE YOUR AURA
//         </button>

//       </section>

//       {/* Spec callouts — hidden on mobile via SpecPointer's own hidden md:block */}
//       <div>
//         <div className="relative h-[80vh]">
//           {specPointers.map((pointer) => (
//             <SpecPointer
//               key={pointer.id}
//               viewBox={pointer.viewBox}
//               label={pointer.label}
//               textX={pointer.textX}
//               textY={pointer.textY}
//               path={pointer.path}
//               textOpacity={textOpacity}
//               lineDraw={lineDraw}
//             />
//           ))}
//         </div>

//         <div className="text-white font-geist italic justify-self-center text-[clamp(1.4rem,3vw,44px)] text-center px-4">
//           Engineering the Invisible.
//         </div>
//       </div>

//     </div>
//   );
// }


// // ============================================================
// //  RECOVERY SCORE CARD
// // ============================================================

// function RecoveryScoreCard() {
//   const ref      = useRef(null);
//   const isInView = useInView(ref, { once: true });
//   const count    = useMotionValue(0);
//   const rounded  = useTransform(count, (latest) => Math.round(latest));

//   useEffect(() => {
//     if (isInView) animate(count, 94, { duration: 2 });
//   }, [isInView]);

//   return (
//     <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-2 hover:scale-110 transition-all ease-in-out">
//       <div className="font-gmono text-prtext text-[clamp(0.6rem,1vw,1rem)]">RECOVERY SCORE</div>
//       <motion.div ref={ref} className="text-[clamp(2rem,4vw,4rem)] font-gmono justify-self-center">
//         {rounded}
//       </motion.div>
//     </div>
//   );
// }


// // ============================================================
// //  FEATURES SECTION
// //
// //  Mobile  — simple stacked single-column cards, no ghost layer.
// //            The -mt-[465px] trick only works at one viewport
// //            width so it's desktop-only.
// //  Desktop — original double-layer ghost + real bento grid.
// // ============================================================

// function FeaturesSection() {
//   return (
//     <section className="w-full flex flex-col items-center my-10 gap-6">

//       <div className="text-prtext font-geist text-[clamp(1.4rem,2.5vw,3rem)] mb-6 md:mb-10 italic text-center px-4">
//         "The List is Endless."
//       </div>

//       {/* ===================== MOBILE LAYOUT ===================== */}
//       <div className="flex md:hidden flex-col w-[90%] gap-4 text-prtext">

//         {/* Activity Monitoring */}
//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-4">
//           <div className="font-gmono mb-3">ACTIVITY MONITORING</div>
//           <div className="flex justify-around font-gmono text-[11px] text-center mb-4">
//             <span><img src={AT1} alt="" className="mx-auto mb-1 h-8" /> Activity Intensity</span>
//             <span><img src={AT2} alt="" className="mx-auto mb-1 h-8" /> SPO2 Levels</span>
//             <span><img src={AT3} alt="" className="mx-auto mb-1 h-8" /> Calories Burnt</span>
//           </div>
//           <ul className="font-gmono text-[13px] space-y-2 list-disc pl-5">
//             <li>Time in high-intensity zones vs. light movement.</li>
//             <li>Real-time respiratory saturation monitoring.</li>
//             <li>Total active and resting energy expenditure.</li>
//           </ul>
//         </div>

//         {/* Recovery + Vagal row */}
//         <div className="grid grid-cols-2 gap-4">
//           <RecoveryScoreCard />
//           <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-3">
//             <div className="font-gmono text-[clamp(0.6rem,2.5vw,1rem)]">VAGAL TONE</div>
//             <img src={HeartIcon} className="h-16 mx-auto mt-2" alt="" />
//           </div>
//         </div>

//         {/* Haptic Alarm */}
//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-4 relative overflow-hidden min-h-[100px]">
//           <div className="font-gmono">HEPTIC ALARM</div>
//           <img src={HepticAlarm} className="absolute top-0 left-0 rounded-2xl h-full w-full object-cover -z-10" alt="" />
//         </div>

//         {/* Sleep Monitoring */}
//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-4">
//           <div className="font-gmono">SLEEP QUALITY MONITORING</div>
//           <div className="flex flex-col items-center mt-3 gap-3">
//             <img src={SleepMonitoring} className="h-24" alt="" />
//             <span className="font-gmono text-[13px]">Real-time health insights.</span>
//           </div>
//         </div>

//         {/* Temp + Battery row */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-3">
//             <div className="font-gmono text-[clamp(0.6rem,2.5vw,1rem)]">BODY TEMP</div>
//             <img src={TempBar} className="h-16 mx-auto" alt="" />
//             <div className="font-gmono text-[2rem]">37°</div>
//           </div>
//           <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-3">
//             <div className="font-gmono text-[clamp(0.6rem,2.5vw,1rem)]">BATTERY LIFE</div>
//             <img src={BatteryIcon} className="h-16 mx-auto" alt="" />
//             <div className="flex font-gmono items-center gap-1">
//               <span className="text-[2rem]">8</span>
//               <span className="text-[11px]">Days</span>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* ===================== DESKTOP LAYOUT ===================== */}

//       {/* Ghost depth layer */}
//       <div className="hidden md:grid w-[90%] h-[75vh] p-2 grid-rows-3 grid-cols-6 gap-6 text-prtext opacity-20">
//         <div className="bento blur-md rounded-2xl row-span-3 col-span-2" />
//         <div className="bento blur-md rounded-2xl" />
//         <div className="bento blur-md rounded-2xl" />
//         <div className="bento blur-md rounded-2xl col-span-2" />
//         <div className="bento blur-md rounded-2xl col-span-2 row-span-2" />
//         <div className="bento blur-md rounded-2xl row-span-2" />
//         <div className="bento blur-md rounded-2xl row-span-2" />
//       </div>

//       {/* Real card layer */}
//       <div className="hidden md:grid w-[90%] h-[75vh] p-2 grid-rows-3 grid-cols-6 gap-6 text-prtext -mt-[465px]">

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl row-span-3 col-span-2 p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">ACTIVITY MONITORING</div>
//           <div className="flex gap-7 font-gmono text-[12px] text-center w-[83%] justify-self-center mt-10">
//             <span><img src={AT1} alt="" /> Activity Intensity</span>
//             <span><img src={AT2} alt="" /> SPO2 Levels</span>
//             <span><img src={AT3} alt="" /> Calories Burnt</span>
//           </div>
//           <ul className="mt-14 font-gmono text-[14px] space-y-3 list-disc pl-6">
//             <li>Time in high-intensity zones vs. light movement.</li>
//             <li>Real-time respiratory saturation monitoring.</li>
//             <li>Total active and resting energy expenditure.</li>
//           </ul>
//         </div>

//         <RecoveryScoreCard />

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">VAGAL TONE</div>
//           <img src={HeartIcon} className="h-[60%] justify-self-center mt-3" alt="" />
//         </div>

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl col-span-2 p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">HEPTIC ALARM</div>
//           <span>
//             <img src={HepticAlarm} className="absolute top-0 left-0 rounded-2xl h-[100%] w-[100%] -z-10" alt="" />
//           </span>
//         </div>

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl col-span-2 row-span-2 p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">SLEEP QUALITY MONITORING</div>
//           <span className="font-gmono justify-self-center flex flex-col items-center mt-4 gap-6">
//             <img src={SleepMonitoring} className="h-[60%]" alt="" />
//             Real-time health insights.
//           </span>
//         </div>

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl row-span-2 p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">BODY TEMPREATURE</div>
//           <img src={TempBar} className="h-[60%] justify-self-center" alt="" />
//           <div className="font-gmono text-[3rem]">37°</div>
//         </div>

//         <div className="bg-transparent backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl row-span-2 p-2 hover:scale-110 transition-all ease-in-out">
//           <div className="font-gmono">LONG BATTERY LIFE</div>
//           <img src={BatteryIcon} className="h-[50%] justify-self-center" alt="" />
//           <div className="flex font-gmono items-center gap-3">
//             <span className="text-[3rem]">8</span>
//             Days Long Lasting
//           </div>
//         </div>

//       </div>

//     </section>
//   );
// }


// // ============================================================
// //  COLOR VARIANT SECTION
// // ============================================================

// function ColorVariantSection() {

//   const ringVariants = [
//     { id: "black",  src: RingBlack,  heading: "Bold. Silent. Absolute.",  subtext: "Deep, obsidian PVD coating. Designed for those who prefer power without the noise." },
//     { id: "silver", src: RingSilver, heading: "Pure Resilience.",          subtext: "Raw, aerospace-grade finish. Industrial strength meets a refined, matte edge." },
//     { id: "gold",   src: RingGold,   heading: "18K Sophistication.",       subtext: "High-luster elegance. A premium gold finish designed to endure the everyday." },
//   ];

//   const colorRef = useRef(null);

//   const { scrollYProgress: progress } = useScroll({
//     target: colorRef,
//     offset: ["start start", "end end"],
//   });

//   // Black — exits left with rotation
//   const xBlack       = useTransform(progress, [0.20, 0.40], [0, -800]);
//   const yBlack       = useTransform(progress, [0, 1], [0, 0]);
//   const rotateZBlack = useTransform(progress, [0.20, 0.40], [0, 70]);
//   const opacityBlack = useTransform(progress, [0.20, 0.35], [1, 0]);

//   // Silver — rises from bottom rotating, exits left rotating
//   const xSilver       = useTransform(progress, [0.60, 0.80], [0, -800]);
//   const ySilver       = useTransform(progress, [0.20, 0.40], [800, 0]);
//   const rotateZSilver = useTransform(progress, [0.20, 0.40, 0.60, 0.80], [-70, 0, 0, 70]);
//   const opacitySilver = useTransform(progress, [0.33, 0.46, 0.60, 0.73], [0, 1, 1, 0]);

//   // Gold — rises from bottom rotating, holds
//   const xGold       = useTransform(progress, [0, 1], [0, 0]);
//   const yGold       = useTransform(progress, [0.60, 0.80], [800, 0]);
//   const rotateZGold = useTransform(progress, [0.60, 0.80], [-70, 0]);
//   const opacityGold = useTransform(progress, [0.73, 0.86], [0, 1]);

//   const ringMotionValues = [
//     { x: xBlack,  y: yBlack,  rotateZ: rotateZBlack,  opacity: opacityBlack  },
//     { x: xSilver, y: ySilver, rotateZ: rotateZSilver, opacity: opacitySilver },
//     { x: xGold,   y: yGold,   rotateZ: rotateZGold,   opacity: opacityGold   },
//   ];

//   return (
//     <section ref={colorRef} className="h-[300vh] relative">

//       {/* On mobile: stack ring above text. On desktop: side by side. */}
//       <div className="sticky top-0 h-screen flex flex-col md:grid md:grid-cols-2 items-center overflow-hidden">

//         {/* Ring column */}
//         <div className="relative w-full flex justify-center items-center flex-1 md:flex-none md:h-full">
//           {ringVariants.map((variant, i) => (
//             <motion.img
//               key={variant.id}
//               src={variant.src}
//               style={{
//                 x:       ringMotionValues[i].x,
//                 y:       ringMotionValues[i].y,
//                 rotateZ: ringMotionValues[i].rotateZ,
//                 opacity: ringMotionValues[i].opacity,
//               }}
//               className="absolute w-[55vw] max-w-[260px] md:w-auto md:max-w-[400px]"
//             />
//           ))}
//         </div>

//         {/* Text column */}
//         <div className="relative w-full text-center md:text-right p-4 h-36 md:h-40 self-end md:self-auto mb-8 md:mb-0">
//           {ringVariants.map((variant, i) => (
//             <motion.div
//               key={variant.id}
//               style={{ opacity: ringMotionValues[i].opacity }}
//               className="absolute inset-x-4 md:right-4 md:left-auto top-0 flex flex-col items-center md:items-end gap-2"
//             >
//               <span className="font-geist text-prtext text-[clamp(1.4rem,3.5vw,44px)] font-semibold leading-tight">
//                 {variant.heading}
//               </span>

//               {variant.subtext && (
//                 <span className="font-gmono text-sectext text-[clamp(0.65rem,1.2vw,14px)] w-full md:w-[60%] text-center md:text-right">
//                   {variant.subtext}
//                 </span>
//               )}

//               <button className="bg-blue-800 rounded-full text-ctalight p-2 px-3 font-geist border-2 border-ctalight mt-2 text-[clamp(0.7rem,1vw,1rem)]">
//                 RESERVE YOUR AURA
//               </button>
//             </motion.div>
//           ))}
//         </div>

//       </div>

//     </section>
//   );
// }


// // ============================================================
// //  COMPARISON TABLE
// // ============================================================

// function ComparisonTable() {

//   const comparisonData = [
//     { feature: "Battery Life",  zenRing: "8+ Days",            smartwatch: "18–24 Hours"            },
//     { feature: "Sleep Comfort", zenRing: "Zero-Bulk Design",   smartwatch: "Heavy & Distracting"    },
//     { feature: "Focus",         zenRing: "Screen-free Living", smartwatch: "Constant Notifications"  },
//     { feature: "Durability",    zenRing: "Grade 5 Titanium",   smartwatch: "Fragile Glass Screens"   },
//     { feature: "Form Factor",   zenRing: "Weightless (2.4g)",  smartwatch: "Bulky & Heavy"           },
//   ];

//   return (
//     <section className="w-full flex flex-col items-center my-20 px-4 md:px-10">

//       <div className="text-prtext font-geist text-[clamp(1.6rem,4vw,52px)] font-bold mb-12 text-center drop-shadow-[0_10px_12px_rgba(29,78,216,0.3)]">
//         The Future is <span className="italic font-gmono font-light">Screenless.</span>
//       </div>

//       <table className="w-full md:w-[90%] border-collapse">
//         <thead>
//           <tr className="border-b border-white/20">
//             <th className="text-left font-geist text-sectext font-bold text-[clamp(0.8rem,2vw,24px)] py-4 w-[33%]">Feature</th>
//             <th className="text-left font-geist text-sectext font-bold text-[clamp(0.8rem,2vw,24px)] py-4 w-[33%]">Zen Ring</th>
//             <th className="text-left font-geist text-sectext font-bold text-[clamp(0.8rem,2vw,24px)] py-4 w-[33%]">Smartwatches</th>
//           </tr>
//         </thead>
//         <tbody>
//           {comparisonData.map((row) => (
//             <tr key={row.feature} className="border-b border-white/10">
//               <td className="font-geist text-prtext font-bold py-4 text-[clamp(0.75rem,1.5vw,18px)]">{row.feature}</td>
//               <td className="font-gmono text-prtext font-bold py-4 text-[clamp(0.7rem,1.2vw,15px)]">{row.zenRing}</td>
//               <td className="font-gmono text-sectext font-normal py-4 text-[clamp(0.7rem,1.2vw,15px)]">{row.smartwatch}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </section>
//   );
// }


// // ============================================================
// //  CTA SECTION
// // ============================================================

// function CTA() {

//   const ringVariants = [
//     { id: "black",  src: RingBlack,  price: "$229", color: "Black"  },
//     { id: "silver", src: RingSilver, price: "$229", color: "Silver" },
//     { id: "gold",   src: RingGold,   price: "$229", color: "Gold"   },
//   ];

//   const [selectedRing, setSelectedRing] = useState(ringVariants[0]);

//   return (
//     <>
//       {/* SECTION 1 — hero CTA banner */}
//       <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[50vh] md:h-[100vh] py-10 md:py-0">

//         <div className="flex justify-center items-center px-4 md:pl-10">
//           <img src={RingCharging} className="h-[45vw] max-h-[480px] w-auto" alt="" />
//         </div>

//         <div className="flex flex-col items-center md:items-start justify-center px-6 md:px-0 md:pt-32 gap-2">
//           <span className="text-prtext font-geist text-[clamp(1.6rem,3vw,4rem)] text-center md:text-right md:pr-10">
//             Ready to Find Your Zen?
//           </span>
//           <p className="text-sectext font-gmono text-[clamp(0.9rem,2vw,26px)] text-center md:text-right md:w-[85%]">
//             Join 50,000+ early adopters who traded distractions for data.
//           </p>
//         </div>

//       </div>

//       {/* SECTION 2 — ring selector */}
//       <div className="flex flex-col items-center mb-20 gap-2">

//         <img src={selectedRing.src} alt={selectedRing.color} className="h-48 md:h-80" />

//         {/* Glow */}
//         <div
//           className="h-[15px] w-[200px] md:w-[300px] blur-sm opacity-20 -mt-2"
//           style={{
//             background: `radial-gradient(ellipse at center,
//               rgba(34,197,94,0.8)  0%,
//               rgba(34,197,94,0.4) 40%,
//               rgba(34,197,94,0.1) 70%,
//               transparent         100%)`,
//           }}
//         />

//         <div className="text-prtext font-geist font-bold text-[clamp(1.8rem,4vw,44px)]">Zen Ring</div>
//         <div className="font-gmono text-sectext tracking-wider text-[clamp(0.7rem,1.2vw,1rem)]">
//           Master Your Inner Metric.
//         </div>

//         {/* Color selector */}
//         <div className="flex flex-wrap justify-center gap-3 mt-4">
//           {ringVariants.map((ring) => (
//             <button
//               key={ring.id}
//               onClick={() => setSelectedRing(ring)}
//               className={`text-prtext border px-6 md:px-8 py-2 rounded-full text-[clamp(0.75rem,1vw,1rem)] transition-all ${
//                 selectedRing.id === ring.id ? "bg-blue-900 text-white border-blue-900" : ""
//               }`}
//             >
//               {ring.color}
//             </button>
//           ))}
//         </div>

//         {/* Price + order */}
//         <div className="flex gap-4 items-center mt-2">
//           <span className="text-prtext font-geist font-bold text-[clamp(2rem,4vw,48px)]">
//             {selectedRing.price}
//           </span>
//           <button className="bg-blue-800 rounded-full text-ctalight h-[46px] px-6 md:px-9 font-geist border-2 border-ctalight text-[clamp(0.75rem,1vw,1rem)]">
//             Order
//           </button>
//         </div>

//       </div>
//     </>
//   );
// }


// // ============================================================
// //  FOOTER
// // ============================================================

// function Footer() {
//   return (
//     <div className="flex flex-col items-center pb-10">
//       <div className="h-[1px] bg-gray-500/20 w-full" />
//       <img src={Logo} alt="" className="h-14 md:h-20 mt-10" />
//       <div className="font-geist text-prtext text-[clamp(1.2rem,2vw,2rem)]">ZEN RING</div>
//       <div className="font-gmono text-sectext tracking-wider text-[clamp(0.7rem,1vw,1rem)]">
//         Master Your Inner Metric.
//       </div>
//       <div className="flex gap-8 text-sectext text-[clamp(1rem,2vw,24px)] mt-3">
//         <FaInstagram /> <FaXTwitter /> <FaFacebookF />
//       </div>
//       <div className="font-gmono text-sectext text-[clamp(0.7rem,1vw,15px)] mt-1">
//         @ZenRing.Official
//       </div>
//     </div>
//   );
// }


// // ============================================================
// //  ROOT
// // ============================================================

// function App() {
//   return (
//     <>
//       <Navbar />
//       <HeroSection />
//       <FeaturesSection />
//       <ColorVariantSection />
//       <ComparisonTable />
//       <CTA />
//       <Footer />
//     </>
//   );
// }

// export default App;