/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SITE CONTENT — the single source of truth
 * ─────────────────────────────────────────────────────────────────────────────
 * Components in this project render structure; they never hard-code copy.
 * Everything you'd want to edit after a new project, a new job, or a new
 * result lives in this file.
 *
 * The types below are deliberately strict. If you add a project and forget the
 * `summary`, TypeScript fails the build rather than shipping a blank card.
 *
 * Two conventions worth knowing:
 *
 *   `AssetRef.src: null`  → the image doesn't exist yet. <AssetImage> renders a
 *                           labelled placeholder telling you the exact path to
 *                           drop the file into. Nothing silently 404s.
 *
 *   `repoUrl / liveUrl: null` → the link doesn't exist. The button is not
 *                           rendered at all, rather than pointing at "#".
 */

export type AssetRef = {
  /** Path under /public, or null if the asset hasn't been supplied yet. */
  src: string | null;
  /** Required. Describes the image for screen readers and for the placeholder. */
  alt: string;
  /** Optional visible caption. Use this for attribution — see GSIL below. */
  caption?: string;
  /** Intrinsic pixel dimensions. Lets next/image reserve space and avoid CLS. */
  width: number;
  height: number;
  /**
   * How this specific image should be framed.
   *
   * This lives on the asset rather than in the component because only the
   * content author knows what an image *is*. A UI screenshot must not be
   * cropped, so it needs `contain`; a photograph should fill its frame, so it
   * needs `cover` — and a portrait photograph shown in a landscape frame needs
   * a crop anchor so the subject doesn't lose their head.
   *
   * The alternative is a component that branches on `project.id`, which works
   * right up until you add a project and wonder why its screenshots are
   * cropped.
   */
  display?: {
    /** Tailwind aspect class, e.g. "aspect-[16/9]". Omit for intrinsic size. */
    aspect?: string;
    fit?: "cover" | "contain";
    /** Tailwind object-position, e.g. "object-[center_42%]". */
    objectPosition?: string;
  };
};

export type Metric = {
  value: string;
  label: string;
};

export type Project = {
  id: string;
  title: string;
  /** Where the work happened. Renders as small context above the title. */
  context: string;
  /** One or two sentences. Lead with the outcome, not the process. */
  summary: string;
  /** Longer detail, shown on the featured project only. */
  detail?: string[];
  metrics?: Metric[];
  tech: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  /** Further outbound links beyond the site and repo, e.g. a companion app. */
  extraLinks?: { label: string; href: string }[];
  /** Renders as the reason there's no link, so a recruiter isn't left guessing. */
  linkNote?: string;
  images: AssetRef[];
};

/* ── Identity ─────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Jacob Hailemariam",
  /** Sits directly under the name. States what he is, in one breath. */
  identity:
    "Electrical Engineering student building software and ML/AI systems",
  /** The voice line. Short, specific, no "passionate developer" energy. */
  tagline:
    "Second year at the University of Calgary. I train models on hyperspectral data, ship backend services, and route my own PCBs.",
  location: "Calgary, Alberta",
  email: "jacob.hailemariam@ucalgary.ca",
  github: "https://github.com/JacobHailemariam",
  linkedin: "https://www.linkedin.com/in/jacob-hailemariam",
  /** Served from /public. Replace the PDF in place to update it. */
  resume: "/Jacob-Hailemariam-Resume.pdf",
} as const;

/* ── About ────────────────────────────────────────────────────────────────── */

export const about = {
  /** Shaped from Jacob's own words. Substance and voice are his. */
  paragraphs: [
    "I'm an electrical engineering student with a computer engineering minor who fell hard for machine learning. What pulls me in is how much of it is actually usable — these systems solve real problems right now, and I want to be one of the people advancing them.",
    "The other half of me lives closer to the metal. I like circuits and PCBs, and I want to go deeper into embedded systems and point that at autonomous and computer-vision robotics — the place where the model and the hardware have to agree with each other.",
    "Coding, software engineering, and cybersecurity have been constants throughout. Long term I'm aiming at a big-industry software role where the work reaches enough people to matter.",
  ],
  offTheClock:
    "Off the clock: basketball, ping pong, anime, and a Smash Bros habit I'm not apologising for.",
  photo: {
    src: "/images/jacob.jpg",
    alt: "Jacob Hailemariam",
    width: 400,
    height: 400,
  } satisfies AssetRef,
};

/* ── Projects ─────────────────────────────────────────────────────────────── */

/**
 * GSIL is the headline. It renders through <FeaturedProject>, which gets its
 * own full-bleed layout — deliberately not the same shape as the cards below.
 */
export const featuredProject: Project = {
  id: "gsil",
  title: "AI for remote sensing and Earth observation",
  context: "Geospatial Sensing & Intelligence Lab · Prof. Lincoln Xu · May 2026 — present",
  summary:
    "Undergraduate researcher on an NSERC USRA, integrating machine learning with hyperspectral and LiDAR sensing to extract environmental information from Earth observation data.",
  detail: [
    "The work spans the full pipeline: collecting hyperspectral and LiDAR sensor data, preprocessing it into something a model can learn from, and building the models that pull environmental signal back out.",
    "A lot of it is hands-on with low-cost hyperspectral platforms and LiDAR hardware — learning the instrument alongside the algorithm, which changes how you read the data.",
    "It feeds environmental monitoring, ecosystem analysis, and sustainable resource management.",
  ],
  tech: [
    "PyTorch",
    "Hyperspectral imaging",
    "LiDAR",
    "Geospatial processing",
    "Python",
    "NumPy",
  ],
  repoUrl: null,
  liveUrl: null,
  linkNote: "Unpublished research — no public repository.",
  images: [
    {
      src: "/images/gsil-hyperspectral.webp",
      alt: "False-colour composite of the Houston 2013 hyperspectral scene after principal component analysis, showing vegetation in green and built structures in red and magenta.",
      caption:
        "Principal-component false-colour composite of the Houston 2013 scene (2013 IEEE GRSS Data Fusion Contest), one of the benchmark datasets used in this work. Public dataset; visualisation generated during preprocessing.",
      width: 1330,
      height: 284,
    },
    {
      src: "/images/houston2013-groundtruth.png",
      alt: "Houston 2013 dataset: (a) false-colour composite of the scene and (b) ground-truth labels for 15 land-cover classes, including grass, trees, water, residential, commercial, roads, highway, railway, and parking lots.",
      caption:
        "Houston 2013: (a) false-colour composite, (b) ground-truth labels across 15 land-cover classes. Public dataset, 2013 IEEE GRSS Data Fusion Contest.",
      width: 733,
      height: 272,
      display: { aspect: "aspect-[733/272]", fit: "contain" },
    },
    {
      src: "/images/gsil-architecture.png",
      alt: "DAHGMN architecture diagram: CNN feature extraction for hyperspectral and LiDAR inputs, spectral and spatial attention fusion, a hybrid GCN–Mamba feature-processing block, and probability-based decision fusion for classification.",
      caption:
        "Baseline architecture this work builds on: DAHGMN, from Z. Xie, L. Lv, H. Gao, S. Xu, and H. Xie, “Dual-Feature Attention Hybrid GCN Mamba Network for Joint Hyperspectral and LiDAR Classification,” IEEE Transactions on Geoscience and Remote Sensing, vol. 63, 2025, doi:10.1109/TGRS.2025.3605373. Figure reproduced from the paper for reference — not my design.",
      width: 960,
      height: 442,
      display: { aspect: "aspect-[960/442]", fit: "contain" },
    },
  ],
};

export const projects: Project[] = [
  {
    id: "vit",
    title: "Vision Transformer for CIFAR-10, from scratch",
    context: "Personal research build",
    summary:
      "A 13.4M-parameter ViT written from the patch embedding up in PyTorch — no convolutions, no pretrained weights — reaching 89.63% test accuracy on CIFAR-10.",
    detail: [
      "Patch embedding, CLS token, learned positional encoding, and seven pre-LayerNorm self-attention blocks with stochastic depth.",
      "Trained with the modern recipe: MixUp/CutMix, EMA weights, RandAugment, label smoothing, mixed precision, and a cosine schedule with warmup.",
    ],
    metrics: [
      { value: "89.63%", label: "test accuracy" },
      { value: "13.4M", label: "parameters" },
      { value: "0", label: "pretrained weights" },
    ],
    tech: [
      "PyTorch",
      "Vision Transformer",
      "MixUp / CutMix",
      "EMA",
      "AMP",
      "Python",
    ],
    repoUrl: "https://github.com/JacobHailemariam/cifar10-vision-transformer",
    liveUrl: null,
    images: [
      {
        src: "/images/vit-loss.png",
        alt: "Training and validation loss over 190 epochs. Validation loss falls smoothly from about 2.1 to 0.76 and stays below the noisier training loss; the best epoch by validation loss is 170.",
        caption:
          "Training vs validation loss. Validation sits below training because MixUp/CutMix and stochastic depth only apply at train time. Best epoch: 170.",
        width: 824,
        height: 412,
        display: { aspect: "aspect-[2/1]", fit: "contain" },
      },
      {
        src: "/images/vit-confusion.png",
        alt: "Row-normalised confusion matrix across the ten CIFAR-10 classes for the best EMA model. Automobile is highest at 95.7 percent; cat is lowest at 76.7 percent, with 10.7 percent misread as dog and 11.2 percent of dogs misread as cat.",
        caption:
          "Per-class confusion, best EMA weights on the test set. Cat and dog are the hard pair — about 11% of each is mistaken for the other.",
        width: 1176,
        height: 960,
        display: { aspect: "aspect-[1176/960]", fit: "contain" },
      },
    ],
  },
  {
    id: "url-shortener",
    title: "URL shortener with cache-aside and rate limiting",
    context: "Backend systems build",
    summary:
      "A FastAPI REST service that shortens URLs behind a Redis cache-aside layer and a per-client fixed-window rate limiter, containerised with Docker Compose.",
    detail: [
      "Redis serves hot redirects so Postgres is never touched on a cache hit; misses write back with a one-hour TTL.",
      "The limiter keys an atomic counter per client IP with a 60-second expiry — the expiry is the window. Over-limit requests get an HTTP 429.",
    ],
    metrics: [
      { value: "1,114", label: "req/s sustained" },
      { value: "40 ms", label: "p50 latency" },
      { value: "0 / 2000", label: "failed requests" },
    ],
    tech: [
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker Compose",
      "SQLAlchemy",
      "REST",
    ],
    repoUrl: "https://github.com/JacobHailemariam/url-shortener",
    // No demo is deployed yet. See "Deploying the live API demo" in the README.
    liveUrl: null,
    images: [
      {
        src: "/images/url-shortener-docs.png",
        alt: "Auto-generated Swagger UI for the URL Shortener API, showing the health-check endpoint and the POST /shorten endpoint expanded with its long_url JSON request body.",
        caption: "Auto-generated OpenAPI docs at /docs.",
        width: 1280,
        height: 660,
        display: { aspect: "aspect-[1280/660]", fit: "contain" },
      },
    ],
  },
  {
    id: "enginquire",
    title: "EngInQuire",
    context: "Co-founder",
    summary:
      "A pre-semester academic prep venture for incoming Schulich engineering students. I built and shipped enginquire.com and taught a six-hour session to roughly 100 first-years.",
    detail: [
      "The site is a responsive SPA with tab-based routing, a serverless booking pipeline, and a 20-question practice-test engine.",
      "I also built the First-Year Blueprint Generator — a Vercel-deployed app that uses the Gemini API to turn a student's course load into a personalised weekly study schedule.",
      "Secured Project90 and Schulich ROAM partnerships.",
    ],
    metrics: [
      { value: "~100", label: "students taught" },
      { value: "6 hrs", label: "of instruction delivered" },
      { value: "2", label: "campus partnerships" },
    ],
    tech: [
      "JavaScript",
      "Serverless functions",
      "Gemini API",
      "Vercel",
      "Responsive SPA",
    ],
    repoUrl: null,
    liveUrl: "https://enginquire.com",
    extraLinks: [
      {
        label: "Blueprint Generator",
        href: "https://enginquire-schedule-generator.vercel.app/",
      },
    ],
    images: [
      {
        src: "/images/enginquire-cohort.jpg",
        alt: "Roughly a hundred incoming engineering students posing together in a University of Calgary lecture hall, with the EngInQuire materials science slides projected behind them.",
        caption: "The 2026 pre-semester cohort, ENGG 204 session.",
        width: 1600,
        height: 1066,
        display: { aspect: "aspect-[16/10]", fit: "cover" },
      },
      {
        src: "/images/enginquire-teaching.jpg",
        alt: "Jacob teaching at the front of a lecture hall beside a projected EngInQuire slide about pursuing opportunities early.",
        caption: "Teaching the pre-semester session.",
        width: 1200,
        height: 1600,
        // Portrait source in a landscape frame. The crop is anchored above
        // centre so the presenters and the projected slides stay in shot.
        display: {
          aspect: "aspect-[16/9]",
          fit: "cover",
          objectPosition: "object-[center_42%]",
        },
      },
    ],
  },
  {
    id: "simon-says",
    title: "Simon Says, breadboard to fabricated board",
    context: "Zeus Electric Motorsport",
    summary:
      "An end-to-end hardware build: breadboard prototype, then a custom 2-layer PCB drawn in Altium Designer, MicroPython firmware on a Raspberry Pi Pico, simulator verification, and deployment to the real board.",
    detail: [
      "Schematic capture and layout both done in Altium — component placement, net routing, and footprint selection for the Pico, tactile switches, LEDs, and current-limiting resistors.",
      "Firmware verified in simulation before committing to fabrication, which caught the wiring mistakes while they were still free to fix.",
    ],
    tech: [
      "Altium Designer",
      "PCB design",
      "MicroPython",
      "Raspberry Pi Pico",
      "Soldering",
    ],
    repoUrl: null,
    liveUrl: null,
    linkNote: "Hardware project — no repository.",
    images: [
      {
        src: "/images/altium-layout.png",
        alt: "Altium Designer PCB layout showing the Raspberry Pi Pico footprint routed to four tactile switches, four LEDs, and current-limiting resistors across a two-layer board.",
        caption: "Two-layer board layout in Altium Designer.",
        width: 1590,
        height: 1046,
      },
      {
        src: "/images/altium-schematic.png",
        alt: "Altium Designer schematic for the Simon Says circuit: a PJ-102A barrel jack feeding an L7805CV 5 V regulator that powers the Raspberry Pi Pico, four TS-1109 tactile switches on GP0 to GP3, and four LEDs with 100-ohm current-limiting resistors on GP22, GP26, GP27, and GP28.",
        caption:
          "Schematic capture: L7805 regulator into the Pico, four switches in, four LEDs out.",
        width: 1658,
        height: 900,
      },
    ],
  },
];

/* ── Experience ───────────────────────────────────────────────────────────── */

export type Role = {
  organisation: string;
  title: string;
  period: string;
  /** Two or three lines maximum. A recruiter is skimming. */
  points: string[];
};

export const experience: Role[] = [
  {
    organisation: "Geospatial Sensing & Intelligence Lab, University of Calgary",
    title: "Machine Learning Researcher — NSERC USRA",
    period: "May 2026 — present",
    points: [
      "Design, build, and train PyTorch models (CNNs, Transformers, Mamba) for multimodal fusion of LiDAR and hyperspectral imagery.",
      "Established a reproducible benchmarking protocol across three datasets on shared Linux GPU servers; authoring a first-author manuscript for arXiv.",
      "Built a modular Python pipeline that spatially aligns and transforms large remote-sensing datasets.",
    ],
  },
  {
    organisation: "Student Organization for Aerospace Research (SOAR)",
    title: "Avionics Software Engineer",
    period: "Sep 2026 — present",
    points: [
      "Develop C++ flight software for the Eos rocket avionics, interfacing sensors through object-oriented code.",
      "Contribute to sensor drivers and telemetry modules over I2C, SPI, and UART.",
    ],
  },
  {
    organisation: "Embedded in Embedded — Garmin-affiliated program",
    title: "Member",
    period: "Sep 2026 — present",
    points: [
      "Develop embedded C firmware on a Nordic nRF52840 (ARM Cortex-M4) using Zephyr RTOS.",
      "Working through GPIO, PWM, state machines, BLE, and serial protocols with J-Link debugging.",
    ],
  },
  {
    organisation: "EngInQuire",
    title: "Co-Founder",
    period: "2026",
    points: [
      "Built and deployed enginquire.com and the Gemini-powered First-Year Blueprint Generator.",
      "Taught a six-hour pre-semester session to approximately 100 incoming Schulich students.",
      "Secured Project90 and Schulich ROAM partnerships.",
    ],
  },
  {
    organisation: "Zeus Electric Motorsport",
    title: "Battery Management Systems Engineer",
    period: "2025 — present",
    points: [
      "Work on the battery management side of a student-built electric race vehicle.",
      "Took a Simon Says build from breadboard through custom Altium PCB to deployed firmware on a Raspberry Pi Pico.",
    ],
  },
];

/* ── Skills ───────────────────────────────────────────────────────────────── */

export type SkillGroup = {
  heading: string;
  /** One line explaining why this group exists. Avoids a bare wall of tags. */
  note: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    heading: "Machine learning",
    note: "Architectures I've implemented and trained, not just read about.",
    items: [
      "PyTorch",
      "Vision Transformers",
      "CNNs",
      "Transformers",
      "Mamba / state-space models",
      "Multimodal fusion",
      "Hyperspectral & LiDAR data",
    ],
  },
  {
    heading: "Languages",
    note: "Python for models and services, C and C++ closer to the hardware.",
    items: ["Python", "C++", "C", "TypeScript", "SQL", "MicroPython"],
  },
  {
    heading: "Backend & systems",
    note: "What it takes to get a model or an API off a laptop and onto a machine someone else can hit.",
    items: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Redis",
      "Docker",
      "REST APIs",
      "Git",
      "Linux",
    ],
  },
  {
    heading: "Hardware & embedded",
    note: "Schematic to fabricated board, and the firmware that runs on it.",
    items: [
      "Zephyr RTOS",
      "ARM Cortex-M",
      "J-Link",
      "I2C / SPI / UART",
      "Altium Designer",
      "PCB design",
      "Raspberry Pi Pico",
      "Soldering",
    ],
  },
];

/* ── Navigation ───────────────────────────────────────────────────────────── */

export const navSections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
