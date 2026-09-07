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
  context: "Geospatial Sensing & Intelligence Lab · Prof. Lincoln Xu · Summer 2026",
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
      alt: "False-colour composite of a hyperspectral scene after principal component analysis, showing vegetation in green and built structures in red and magenta.",
      // ⚠️ VERIFY THE DATASET NAME BEFORE PUBLISHING — see README.
      caption:
        "Principal-component false-colour composite of a benchmark hyperspectral scene used in this work. Public dataset; visualisation generated during preprocessing.",
      width: 1330,
      height: 284,
    },
    {
      src: null, // ← drop in /public/images/gsil-architecture.png
      alt: "Baseline model architecture diagram for hyperspectral and LiDAR fusion.",
      // ⚠️ HONESTY: this caption must name the paper this baseline comes from.
      caption:
        "Baseline architecture this work builds on. Source: [ADD CITATION]. Diagram reproduced for reference — not my design. My modifications are labelled separately.",
      width: 1600,
      height: 900,
    },
    {
      src: null, // ← drop in /public/images/gsil-code-1.png
      alt: "Model definition and training loop source code.",
      caption: "Model definition and training loop.",
      width: 1600,
      height: 1000,
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
        src: null, // ← copy from the repo's assets/train_val_accuracy.png
        alt: "Training and validation accuracy curves converging near 90 percent over 190 epochs.",
        caption: "Training and validation accuracy.",
        width: 1200,
        height: 800,
      },
      {
        src: null, // ← copy from the repo's assets/confusion_matrix.png
        alt: "Confusion matrix across the ten CIFAR-10 classes, with cat and dog showing the most overlap.",
        caption: "Per-class confusion. Cat and dog are the hard pair.",
        width: 1200,
        height: 1000,
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
        src: null, // ← copy from the repo's screenshots/api-docs.png
        alt: "Auto-generated Swagger UI listing the shorten, redirect, and health-check endpoints.",
        caption: "Auto-generated OpenAPI docs at /docs.",
        width: 1600,
        height: 900,
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
    // ← Paste the Blueprint Generator URL here to render a second link.
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
        src: null, // ← drop in /public/images/altium-schematic.png
        alt: "Altium Designer schematic capture for the Simon Says circuit.",
        caption: "Schematic capture.",
        width: 1600,
        height: 1000,
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
    title: "Undergraduate Research Assistant — NSERC USRA",
    period: "Summer 2026",
    points: [
      "Collect and preprocess hyperspectral and LiDAR sensor data, then build ML models that extract environmental information from it.",
      "Work hands-on with low-cost hyperspectral platforms and LiDAR hardware.",
      "Research supports environmental monitoring, ecosystem analysis, and sustainable resource management.",
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
      "Hyperspectral & LiDAR data",
    ],
  },
  {
    heading: "Languages",
    note: "Python for models and services, C++ and MicroPython closer to the hardware.",
    items: ["Python", "C++", "JavaScript", "MicroPython"],
  },
  {
    heading: "Backend & systems",
    note: "What it takes to get a model or an API off a laptop and onto a machine someone else can hit.",
    items: [
      "FastAPI",
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
      "Altium Designer",
      "PCB design",
      "Raspberry Pi Pico",
      "Schematic capture",
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
