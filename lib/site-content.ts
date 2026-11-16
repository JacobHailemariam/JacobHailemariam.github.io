/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SITE CONTENT: the single source of truth
 * ─────────────────────────────────────────────────────────────────────────────
 * Components in this project render structure; they never hard-code copy.
 * Everything you'd want to edit after a new project, a new job, or a new
 * result lives in this file.
 *
 * The types below are deliberately strict. If you add a project and forget the
 * `problem`, TypeScript fails the build rather than shipping a blank card.
 *
 * Conventions worth knowing:
 *
 *   `AssetRef.src: null`      → the image doesn't exist yet. <AssetImage>
 *                               renders a labelled placeholder instead.
 *   `repoUrl / liveUrl: null` → the link doesn't exist. No button is rendered.
 *   `resume: null`            → no resume file yet. Every download button on
 *                               the site disappears until it is set.
 */

/**
 * The two channels the whole design is built on, plus a neutral third.
 *   ml → channel 1, teal: models, training, research
 *   hw → channel 2, amber: firmware, boards, embedded
 *   sw → software that is neither (backend, web). Shown without colour.
 */
export type Channel = "ml" | "hw" | "sw";

export type AssetRef = {
  /** Path under /public, or null if the asset hasn't been supplied yet. */
  src: string | null;
  /** Required. Describes the image for screen readers and for the placeholder. */
  alt: string;
  /** Optional visible caption. Use this for attribution. */
  caption?: string;
  /** Intrinsic pixel dimensions. Lets next/image reserve space and avoid CLS. */
  width: number;
  height: number;
  /**
   * How this specific image should be framed. It lives on the asset because
   * only the content author knows what an image is: a UI screenshot must not
   * be cropped (`contain`), a photograph should fill its frame (`cover`).
   */
  display?: {
    /** Tailwind aspect class, e.g. "aspect-[16/9]". Omit for intrinsic size. */
    aspect?: string;
    fit?: "cover" | "contain";
    /** Tailwind object-position, e.g. "object-[center_42%]". */
    objectPosition?: string;
    /** "half" lets two images sit side by side, e.g. a pair of portraits. */
    span?: "half";
  };
};

export type Metric = {
  value: string;
  label: string;
};

/** One block inside an expandable case study. */
export type CaseStudySection = {
  heading: string;
  body?: string[];
  items?: string[];
  /** Preformatted text: a pipeline, a protocol. Rendered in the mono face. */
  code?: string;
};

export type CaseStudy = {
  /** Shown on the closed drawer, so a visitor knows what's inside. */
  teaser: string;
  sections: CaseStudySection[];
  figures: AssetRef[];
};

export type Project = {
  id: string;
  title: string;
  /** Where the work happened. Renders as small context above the title. */
  context: string;
  channels: Channel[];
  /** One or two sentences: what it is and what my part was. */
  summary: string;
  /** The three things a recruiter is scanning for, in this order. */
  problem: string;
  decision: string;
  impact: string;
  metrics?: Metric[];
  tech: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  /** Further outbound links beyond the site and repo, e.g. a demo video. */
  extraLinks?: { label: string; href: string }[];
  /** Renders as the reason there's no link, so nobody is left guessing. */
  linkNote?: string;
  images: AssetRef[];
  /**
   * The home-page card's image, when the first of `images` doesn't crop well
   * to the card's wide frame. Falls back to `images[0]`.
   */
  cover?: AssetRef;
  /** Only the top two projects have one. */
  caseStudy?: CaseStudy;
};

/* ── Identity ─────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Jacob Hailemariam",
  /** Sits directly under the name. States what he is, in one breath. */
  identity:
    "Electrical & Computer Engineering student building embedded software and ML/AI systems",
  tagline:
    "At the University of Calgary, I train models on hyperspectral data, ship backend services, and write embedded firmware for rocket avionics.",
  location: "Calgary, Alberta",
  email: "jacob.hailemariam@ucalgary.ca",
  altEmail: "jacobhailemariam@gmail.com",
  github: "https://github.com/JacobHailemariam",
  linkedin: "https://www.linkedin.com/in/jacob-hailemariam",
  /** Current roles, shown above the name. One per channel. */
  roles: [
    {
      title: "Machine Learning Research Intern",
      org: "UCalgary GSIL",
      channel: "ml",
    },
    {
      title: "Avionics Embedded Software Engineer",
      org: "SOAR Rocketry",
      channel: "hw",
    },
  ] satisfies { title: string; org: string; channel: Channel }[],
  /** Shown in the hero so a visitor sees who this is before scrolling. */
  headshot: {
    src: "/images/jacob-portrait.jpg",
    alt: "Jacob Hailemariam, smiling with arms crossed, in a white shirt, navy vest, and patterned tie on Calgary's Peace Bridge.",
    width: 660,
    height: 880,
  } satisfies AssetRef,
};

/**
 * RESUME DOWNLOAD
 * To switch on the download buttons (header, hero and contact section):
 *   1. Put the PDF in /public, e.g. public/Jacob-Hailemariam-Resume.pdf
 *   2. Replace `null` below with:
 *        { href: "/Jacob-Hailemariam-Resume.pdf",
 *          fileName: "Jacob-Hailemariam-Resume.pdf" }
 * Anything in /public is world-readable, so check the PDF for details you
 * don't want public (a phone number, a home address) first.
 */
export const resume: { href: string; fileName: string } | null = null;

/* ── Projects ─────────────────────────────────────────────────────────────── */

/**
 * GSIL is the headline. It renders through <FeaturedProject>, which gets its
 * own full-width layout, deliberately not the same shape as the cards below.
 */
export const featuredProject: Project = {
  id: "gsil",
  title: "Machine Learning Research Intern: deep multimodal fusion",
  context:
    "Geospatial Sensing & Intelligence Lab · University of Calgary · NSERC USRA · May 2026 to present",
  channels: ["ml"],
  summary:
    "I design and train PyTorch models (CNNs, Transformers, and Mamba state-space models) that fuse two sensors into one prediction: a hyperspectral camera that sees up to 144 bands of light per pixel (a normal camera sees 3), and LiDAR that measures height in 3-D. The result is a map of what's on the ground.",
  problem:
    "Each sensor alone is ambiguous. A roof and a road can have almost the same spectrum, and so can grass and trees. LiDAR separates them by height but can't tell road from grass from water.",
  decision:
    "Fuse both in one model that learns when to trust which signal. I reproduce DAHGMN, a hybrid graph-convolution and Mamba network, as the baseline and build on it, with every model run through the same benchmarking protocol.",
  impact:
    "A reproducible benchmark across three public datasets on shared Linux GPU servers, and a manuscript for arXiv with Yimin Zhu, where I am second author.",
  metrics: [
    { value: "144", label: "bands per pixel, vs 3 in a photo" },
    { value: "3", label: "benchmark datasets" },
    { value: "2nd", label: "author, arXiv manuscript" },
  ],
  tech: [
    "PyTorch",
    "CNNs",
    "Transformers",
    "Mamba / SSMs",
    "Graph convolution",
    "Multimodal fusion",
    "Python",
    "Linux GPU servers",
  ],
  repoUrl: null,
  liveUrl: null,
  linkNote: "Unpublished research, so there is no public repository.",
  images: [
    {
      src: "/images/gsil-scene-thumb.webp",
      alt: "False-colour view of part of the Houston 2013 hyperspectral scene, showing vegetation in green and buildings and roads in red, magenta and blue.",
      caption:
        "Houston 2013 scene (2013 IEEE GRSS Data Fusion Contest) in false colour, one of the benchmark datasets. Public dataset; visualisation generated during preprocessing.",
      width: 378,
      height: 236,
    },
    {
      src: "/images/gsil-architecture.webp",
      alt: "DAHGMN architecture diagram: CNN feature extraction for hyperspectral and LiDAR inputs, spectral and spatial attention fusion, a hybrid GCN and Mamba feature-processing block, and probability-based decision fusion for classification.",
      caption:
        "Baseline architecture this work builds on: DAHGMN, from Z. Xie, L. Lv, H. Gao, S. Xu, and H. Xie, “Dual-Feature Attention Hybrid GCN Mamba Network for Joint Hyperspectral and LiDAR Classification,” IEEE Transactions on Geoscience and Remote Sensing, vol. 63, 2025, doi:10.1109/TGRS.2025.3605373. Figure reproduced from the paper for reference. It is not my design.",
      width: 960,
      height: 442,
      display: { aspect: "aspect-[960/442]", fit: "contain" },
    },
  ],
  caseStudy: {
    teaser: "What I build, the baseline architecture, and the benchmark data",
    sections: [
      {
        heading: "Why one sensor isn't enough",
        body: [
          "A hyperspectral camera records the material of a surface but not its height. LiDAR records height but not material. The model has to learn when to trust which signal, and the interactive demo above shows exactly this: switch sensors and the classifier falls apart, then recovers when both are fused.",
        ],
      },
      {
        heading: "What I build",
        items: [
          "Custom PyTorch datasets, transforms, and training loops.",
          "A modular Python pipeline that spatially aligns and patches large remote-sensing rasters.",
          "A reproducible benchmarking protocol, run across three public datasets on shared Linux GPU servers.",
        ],
      },
      {
        heading: "Where it starts",
        body: [
          "The baseline is DAHGMN, a hybrid graph-convolution and Mamba architecture (diagram above, next to the map). I reproduce it first so every later change is measured against a known result, then build on it.",
        ],
      },
    ],
    figures: [
      {
        src: "/images/houston2013-groundtruth.webp",
        alt: "Houston 2013 dataset: (a) false-colour composite of the scene and (b) ground-truth labels for 15 land-cover classes, including grass, trees, water, residential, commercial, roads, highway, railway, and parking lots.",
        caption:
          "Houston 2013: (a) false-colour composite, (b) ground-truth labels across 15 land-cover classes. Public dataset, 2013 IEEE GRSS Data Fusion Contest.",
        width: 733,
        height: 272,
        display: { aspect: "aspect-[733/272]", fit: "contain" },
      },
    ],
  },
};

export const projects: Project[] = [
  {
    id: "atlas",
    title: "Atlas: a wearable reach-assist robotic arm",
    context: "Cal Hacks 13.0 · Hardware track · San Francisco · Oct 2026",
    channels: ["ml", "hw"],
    summary:
      "An extra arm you wear on a backpack and steer with hand gestures and voice, built in a weekend at Cal Hacks 13.0. My part was the embedded side: firmware and control software.",
    problem:
      "People with limited arm mobility, or jobs that wear out their shoulders and back, could use an extra hand. It has to be steered without a controller, and it moves right next to a person in a loud, crowded hall.",
    decision:
      "Gestures drive it like a joystick, one joint at a time, and the firmware starts disarmed and clamps and rate-limits every joint. I wrote the C++ firmware on the Arduino UNO Q, the Python arm controller, and offline voice control with a wake word.",
    impact:
      "In the hackathon hall, crowd noise set off 6.6 false voice commands a minute. With the wake word we measured 0 in 100 seconds. Capping joint updates at 10 per second per joint keeps the arm from lagging.",
    metrics: [
      { value: "6.6 / min", label: "false voice commands from crowd noise" },
      { value: "0", label: "in 100 s with the wake word" },
      { value: "60°/s", label: "servo speed cap on the board" },
    ],
    tech: [
      "C++",
      "Python",
      "Arduino UNO Q",
      "I2C",
      "PCA9685",
      "MediaPipe",
      "OpenCV",
      "Vosk",
      "MuJoCo",
      "pytest",
    ],
    repoUrl: "https://github.com/JacobHailemariam/james-gestures",
    liveUrl: null,
    cover: {
      src: "/images/atlas-cover.jpg",
      alt: "The Atlas arm standing upright on the backpack on a hackathon table, with the Arduino UNO Q, PWM board and wiring at its base.",
      width: 1440,
      height: 900,
      display: { fit: "cover" },
    },
    images: [
      {
        src: "/images/atlas-bench.jpg",
        alt: "The Atlas arm standing on a table on top of the backpack, with the Arduino UNO Q, PWM board and wiring at its base.",
        caption: "On the table, with the UNO Q and wiring at the base.",
        width: 900,
        height: 1200,
        display: { aspect: "aspect-[3/4]", fit: "cover", span: "half" },
      },
      {
        src: "/images/atlas-worn.jpg",
        alt: "The Atlas arm mounted on a black backpack and worn in the crowded hackathon hall: red and purple 3D-printed links rising over the shoulder, ending in a pink claw.",
        caption: "Worn on the backpack in the hackathon hall.",
        width: 900,
        height: 1200,
        display: { aspect: "aspect-[3/4]", fit: "cover", span: "half" },
      },
      {
        src: "/images/atlas-how-it-works.jpg",
        alt: "Diagram of how Atlas works: a webcam feeds MediaPipe hand points to the JAMES gesture reader, then the arm controller, then the Arduino UNO Q that drives the motors. Offline voice commands feed into the arm controller too.",
        caption:
          "The pipeline: webcam and microphone in, clamped joint commands out to the board.",
        width: 1600,
        height: 640,
        display: { aspect: "aspect-[1600/640]", fit: "contain" },
      },
    ],
    caseStudy: {
      teaser: "Pipeline, gestures, safety logic, serial protocol and the team",
      sections: [
        {
          heading: "How it works",
          body: [
            "A webcam feeds MediaPipe, which finds 21 points on the hand. A gesture reader turns those into poses, and the arm controller turns poses and voice commands into safe joint commands for the board.",
          ],
          code: "webcam -> MediaPipe (21 hand points)\n       -> GestureReader -> ArmController\n       -> serial -> UNO Q firmware -> motors\nmic    -> Vosk (offline) -> VoiceListener\n       -> ArmController",
        },
        {
          heading: "Gestures",
          items: [
            "Open palm held 1 s: arms it. Also the hold-still pose.",
            "Point and move: left and right turns the base, up and down lifts the shoulder.",
            "Peace sign and move: up and down bends the elbow, left and right turns the wrist.",
            "Pinch and release: the claw closes and opens.",
            "Fist: STOP. Everything freezes and disarms.",
            "Hand leaves the camera: holds still, disarms after 2 s.",
            "It works like a joystick, not a mirror: where you start pointing is zero, and how far you move from it sets the speed.",
            "Only the largest hand in view drives, so people in the background can't move the arm.",
          ],
        },
        {
          heading: "Voice",
          body: [
            "Voice runs offline with Vosk and a small English model, so it needs no internet. You say \"james\" first, then the command: stop, grab, release, raise, reach, home, tuck, follow, plus saved poses.",
            "The wake word came from a measurement. In the hall, without it, crowd noise caused 6.6 false commands a minute. With it, 0 in 100 seconds.",
          ],
        },
        {
          heading: "Safety",
          items: [
            "Starts disarmed in both the Python code and the firmware.",
            "Servo outputs stay off at power-up until the first command after arming.",
            "Every joint is clamped to its limits and rate-limited: base 0 to 270 degrees so cables can't wrap, shoulder and elbow 20 to 160, wrist 0 to 180.",
            "The board slews servos at 60 degrees per second on top of that.",
            "If the board drops off USB or reboots, the software disarms and reconnects by itself.",
          ],
        },
        {
          heading: "Firmware and control software (my part)",
          items: [
            "C++ firmware on the UNO Q's microcontroller side, driving the servos through a PCA9685 over I2C and the base stepper through a TB6600.",
            "A text protocol, one command per line at 115200 baud.",
            "A Python arm controller that turns gestures and voice into safe joint commands.",
            "Fixed a pinch-vs-fist misread in the gesture pipeline, verified with pytest.",
            "Wiring and bring-up: I2C, common ground, separate motor power.",
            "A MuJoCo model of the arm that speaks the same protocol as the board, so the software can be tested with no hardware.",
          ],
          code: "PING -> PONG | ARM 1 | ARM 0 | STOP |\nJ <base|shoulder|elbow|wrist> <deg> | CLAW 1 | CLAW 0",
        },
        {
          heading: "Hardware",
          items: [
            "Brain: Arduino UNO Q with a PCA9685 16-channel PWM board (I2C, 0x40, 50 Hz).",
            "Base: NEMA 17 stepper on a TB6600 driver at 1/16 microstepping, on a printed PLA turntable.",
            "Shoulder: ANNIMOS RDS5160SG 60 kg·cm servo. Elbow and wrist: RDS3225SG 25 kg·cm servos.",
            "Claw: 9 g servos driving geared jaws.",
            "Designed in SolidWorks and 3D printed. Joint torque sized the motors and link lengths.",
          ],
        },
        {
          heading: "Team and credits",
          body: [
            "Victor Espinoza (UC Davis) did the arm design, CAD and motors. Semir Haji (UCalgary) did the mechanical build and printing. I did the embedded side, firmware and control software.",
            "The hand-tracking module comes from JAMES, a teammate's earlier project, reused with organizer approval (MIT licensed, credited in the repo). Mentor Dylan Vu helped us with the circuitry.",
          ],
        },
        {
          heading: "What's next",
          body: [
            "EMG muscle-signal control, a proper back harness with onboard power, force sensing, lighter materials, and testing with physical therapists.",
          ],
        },
      ],
      figures: [
        {
          src: "/images/atlas-gestures.gif",
          alt: "Animation of hand gestures driving the arm, with the joint angles and serial commands the code produced shown alongside.",
          caption:
            "Rendered from the real gesture reader and arm controller, fed synthetic hands.",
          width: 900,
          height: 465,
          display: { aspect: "aspect-[900/465]", fit: "contain", span: "half" },
        },
        {
          src: "/images/atlas-build.jpg",
          alt: "Four build photos: the 3D-printed arm with metal servo brackets, the claw with two 9 g servos and geared jaws, the arm mounted on a backpack, and the live gesture view on a laptop.",
          caption:
            "The arm, the claw, the backpack mount and the live gesture view.",
          width: 1600,
          height: 830,
          display: { aspect: "aspect-[900/465]", fit: "contain", span: "half" },
        },
      ],
    },
  },
  {
    id: "citylink",
    title: "CityLink: AI dispatch agent for Calgary 311",
    context: "IEEE Industry Hackathon · 2nd place of 200+ · team of four",
    channels: ["ml"],
    summary:
      "An agent that scores Calgary 311 road tickets by hazard and plans the day for 8 city crews.",
    problem:
      "Worked oldest-first, a day's plan for 8 crews reached only 16 of the 30 open safety tickets. Hazards waited behind routine jobs.",
    decision:
      "Rank by hazard before scheduling: a scikit-learn model scores each ticket and a planner assigns the ranked jobs across the crews' day. The Claude API turns free-text crew updates into structured events, with a rule-based fallback if the API fails and a person confirming every replan.",
    impact:
      "All 30 safety tickets covered, and 48 jobs fit into the day instead of 40 with the same workers. 2nd place of 200+ participants.",
    metrics: [
      { value: "2nd", label: "of 200+ participants" },
      { value: "30 / 30", label: "safety tickets, vs 16 oldest-first" },
      { value: "48", label: "jobs per day, vs 40" },
    ],
    tech: ["Python", "scikit-learn", "Claude API", "Streamlit", "LLM agents"],
    repoUrl:
      "https://github.com/ColbyCadden/IEEE-Industry-Hackathon---Dispatch-agent",
    liveUrl: null,
    extraLinks: [
      {
        label: "Watch the demo",
        href: "https://www.youtube.com/watch?v=p5cgfG4k0kc",
      },
    ],
    images: [
      {
        src: "/images/citylink-dispatch.webp",
        alt: "CityLink running: a 3-D model of downtown Calgary at night with simulated traffic on the streets, a stats bar across the top, and a Dispatch & Calls panel in the corner where crew updates are typed or spoken in.",
        caption:
          "The dispatch view: simulated traffic over a 3-D model of downtown Calgary, with crew updates coming in through the Dispatch & Calls panel.",
        width: 1908,
        height: 952,
        display: { aspect: "aspect-[1908/952]", fit: "contain" },
      },
      {
        src: "/images/citylink-team.jpg",
        alt: "The four-person CityLink team presenting on stage with microphones, the CityLink 3-D city view projected on the screen behind them.",
        caption: "Presenting CityLink at the IEEE Industry Hackathon.",
        width: 1280,
        height: 853,
        display: { aspect: "aspect-[3/2]", fit: "cover" },
      },
    ],
  },
  {
    id: "enginquire",
    title: "EngInQuire",
    context: "Co-founder",
    channels: ["sw"],
    summary:
      "A pre-semester academic prep venture for incoming Schulich engineering students. I built the site and taught the session.",
    problem:
      "Give incoming Schulich engineering students a head start on first-year material before the semester begins, and a way to book it.",
    decision:
      "I built and shipped enginquire.com as a responsive SPA with tab-based routing, a serverless booking pipeline and a 20-question practice-test engine, plus a Vercel-deployed generator that uses the Gemini API to turn a course load into a weekly study schedule.",
    impact:
      "Taught a six-hour session to roughly 100 first-years, and secured Project90 and Schulich ROAM partnerships.",
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
    channels: ["hw"],
    summary:
      "An end-to-end hardware build: breadboard prototype, custom 2-layer PCB, firmware, and deployment to the real board.",
    problem:
      "Take a circuit from a breadboard prototype to a fabricated board. Once a board is fabricated, a wiring mistake is no longer free to fix.",
    decision:
      "Schematic capture and 2-layer layout in Altium Designer (placement, routing and footprints for the Pico, switches, LEDs and resistors), with MicroPython firmware on a Raspberry Pi Pico verified in a simulator before committing to fabrication.",
    impact:
      "Simulation caught the wiring mistakes while they were still free to fix, and the firmware was deployed to the real board.",
    tech: [
      "Altium Designer",
      "PCB design",
      "MicroPython",
      "Raspberry Pi Pico",
      "Soldering",
    ],
    repoUrl: null,
    liveUrl: null,
    linkNote: "Hardware project, so there is no repository.",
    images: [
      {
        src: "/images/altium-layout.png",
        alt: "Altium Designer PCB layout showing the Raspberry Pi Pico footprint routed to four tactile switches, four LEDs, and current-limiting resistors across a two-layer board.",
        caption: "Two-layer board layout in Altium Designer.",
        width: 1590,
        height: 1046,
        display: { aspect: "aspect-[1590/1046]", fit: "contain" },
      },
      {
        src: "/images/altium-schematic.webp",
        alt: "Altium Designer schematic for the Simon Says circuit: a PJ-102A barrel jack feeding an L7805CV 5 V regulator that powers the Raspberry Pi Pico, four TS-1109 tactile switches on GP0 to GP3, and four LEDs with 100-ohm current-limiting resistors on GP22, GP26, GP27, and GP28.",
        caption:
          "Schematic capture: L7805 regulator into the Pico, four switches in, four LEDs out.",
        width: 1658,
        height: 900,
        display: { aspect: "aspect-[1658/900]", fit: "contain" },
      },
    ],
  },
  {
    id: "vit",
    title: "Vision Transformer for CIFAR-10, from scratch",
    context: "Personal research build",
    channels: ["ml"],
    summary:
      "A 13.4M-parameter ViT written from the patch embedding up in PyTorch, with no convolutions and no pretrained weights.",
    problem:
      "Vision Transformers lean on big datasets or pretrained weights. I wanted to see how far one gets on CIFAR-10 with neither, and to understand every layer by writing it.",
    decision:
      "Patch embedding, CLS token, learned positional encoding and seven pre-LayerNorm attention blocks with stochastic depth, trained with the modern recipe: MixUp/CutMix, EMA weights, RandAugment, label smoothing, mixed precision and a cosine schedule with warmup.",
    impact:
      "89.63% test accuracy on CIFAR-10 from 13.4M parameters and zero pretrained weights.",
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
        src: "/images/vit-loss.webp",
        alt: "Training and validation loss over 190 epochs. Validation loss falls smoothly from about 2.1 to 0.76 and stays below the noisier training loss; the best epoch by validation loss is 170.",
        caption:
          "Training vs validation loss. Validation sits below training because MixUp/CutMix and stochastic depth only apply at train time. Best epoch: 170.",
        width: 824,
        height: 412,
        display: { aspect: "aspect-[2/1]", fit: "contain" },
      },
      {
        src: "/images/vit-confusion.webp",
        alt: "Row-normalised confusion matrix across the ten CIFAR-10 classes for the best EMA model. Automobile is highest at 95.7 percent; cat is lowest at 76.7 percent, with 10.7 percent misread as dog and 11.2 percent of dogs misread as cat.",
        caption:
          "Per-class confusion, best EMA weights on the test set. Cat and dog are the hard pair: about 11% of each is mistaken for the other.",
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
    channels: ["sw"],
    summary:
      "A FastAPI REST service that shortens URLs, containerised with Docker Compose.",
    problem:
      "A redirect service is mostly reads, so the database shouldn't be touched on every lookup, and one client shouldn't be able to flood it.",
    decision:
      "A Redis cache-aside layer serves hot redirects so Postgres is skipped on a hit, with misses written back on a one-hour TTL. The rate limiter keys an atomic counter per client IP with a 60-second expiry, so the expiry is the window. Over-limit requests get an HTTP 429.",
    impact:
      "Sustained 1,114 requests per second at 40 ms p50 latency, with 0 failures in 2,000 requests.",
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
];

/* ── Experience ───────────────────────────────────────────────────────────── */

export type Role = {
  organisation: string;
  title: string;
  period: string;
  channel: Channel;
  /** Two or three lines maximum. A recruiter is skimming. */
  points: string[];
};

export const experience: Role[] = [
  {
    organisation: "Geospatial Sensing & Intelligence Lab, University of Calgary",
    title: "Machine Learning Research Intern, NSERC USRA",
    period: "May 2026 to present",
    channel: "ml",
    points: [
      "Design, build, and train PyTorch models (CNNs, Transformers, Mamba) for multimodal fusion of LiDAR and hyperspectral imagery.",
      "Established a reproducible benchmarking protocol across three datasets on shared Linux GPU servers; second author on a manuscript for arXiv with Yimin Zhu.",
      "Built a modular Python pipeline that spatially aligns and transforms large remote-sensing datasets.",
    ],
  },
  {
    organisation: "Student Organization for Aerospace Research (SOAR)",
    title: "Avionics Embedded Software Engineer",
    period: "Sep 2026 to present",
    channel: "hw",
    points: [
      "Develop C++ flight software for the Eos rocket avionics, interfacing sensors through object-oriented code.",
      "Contribute to sensor drivers and telemetry modules over I2C, SPI, and UART.",
    ],
  },
  {
    organisation: "Axial, TechStart UCalgary",
    title: "ML & Computer Vision Developer",
    period: "Oct 2026 to present",
    channel: "ml",
    points: [
      "Student team app that turns phone video of a campus building into a navigable 3D indoor map. You scan a QR code inside the building and the app walks you to the room you need. In progress.",
      "Develop the computer vision and ML pipeline: feature matching between frames with SuperPoint and SuperGlue, and 3D reconstruction of indoor spaces with COLMAP.",
      "Place recognition with NetVLAD so the app knows which part of the building the user is in, and live localization with ARCore/ARKit fused through an Extended Kalman Filter.",
      "Build the Python backend and React features that connect the vision pipeline to the app, with code tracked and reviewed in Git.",
    ],
  },
  {
    organisation: "Embedded in Embedded, a Garmin-affiliated program",
    title: "Member",
    period: "Sep 2026 to present",
    channel: "hw",
    points: [
      "Develop embedded C firmware on a Nordic nRF52840 (ARM Cortex-M4) using Zephyr RTOS.",
      "Working through GPIO, PWM, state machines, BLE, and serial protocols with J-Link debugging.",
    ],
  },
  {
    organisation: "EngInQuire",
    title: "Co-Founder",
    period: "2026",
    channel: "sw",
    points: [
      "Built and deployed enginquire.com and the Gemini-powered First-Year Blueprint Generator.",
      "Taught a six-hour pre-semester session to approximately 100 incoming Schulich students.",
      "Secured Project90 and Schulich ROAM partnerships.",
    ],
  },
  {
    organisation: "Zeus Electric Motorsport",
    title: "Electrical BMS Engineer",
    period: "2025 to Aug 2026",
    channel: "hw",
    points: [
      "Worked on the battery management side of a student-built electric race vehicle.",
      "Took a Simon Says build from breadboard through custom Altium PCB to deployed firmware on a Raspberry Pi Pico.",
    ],
  },
];

/* ── Skills ───────────────────────────────────────────────────────────────── */

export type SkillGroup = {
  heading: string;
  channel: Channel;
  /** One line explaining why this group exists. Avoids a bare wall of tags. */
  note: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    heading: "Machine learning",
    channel: "ml",
    note: "Architectures I've implemented and trained, not just read about.",
    items: [
      "PyTorch",
      "Vision Transformers",
      "CNNs",
      "Transformers",
      "Mamba / state-space models",
      "Multimodal fusion",
      "Hyperspectral & LiDAR data",
      "MediaPipe",
      "SuperPoint / SuperGlue",
      "COLMAP",
      "NetVLAD",
      "ARCore / ARKit",
      "Extended Kalman Filter",
    ],
  },
  {
    heading: "Hardware & embedded",
    channel: "hw",
    note: "Schematic to fabricated board, and the firmware that runs on it.",
    items: [
      "Zephyr RTOS",
      "ARM Cortex-M",
      "Arduino UNO Q",
      "J-Link",
      "I2C / SPI / UART",
      "Altium Designer",
      "PCB design",
      "Raspberry Pi Pico",
      "Soldering",
    ],
  },
  {
    heading: "Languages",
    channel: "sw",
    note: "Python for models and services, C and C++ closer to the hardware.",
    items: ["Python", "C++", "C", "TypeScript", "SQL", "MicroPython"],
  },
  {
    heading: "Backend & systems",
    channel: "sw",
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
];

/* ── Navigation ───────────────────────────────────────────────────────────── */

export const navSections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
