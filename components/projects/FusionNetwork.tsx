import PlayInView from "@/components/ui/PlayInView";

/**
 * The research section's picture of the model: a neural network with two
 * inputs. Hyperspectral and LiDAR each run through their own encoder, meet in
 * the fusion layers, and end at a row of land-cover classes. Signals travel
 * left to right and a different class lights up with each wave, the way the
 * model labels one pixel after another.
 *
 * It is a schematic of the idea, not a layer-by-layer drawing of one model,
 * and the caption says so.
 *
 * HOW IT'S BUILT. The network is described as data (a `Spec`), and the same
 * renderer draws a wide version for desktops and a compact one for phones, so
 * the labels stay readable at both sizes. All motion is CSS (see "FUSION
 * NETWORK" in globals.css) and pauses while the figure is off screen.
 */

type Stream = "hs" | "li" | "fused";

type Layer = { x: number; ys: number[] };

type Spec = {
  width: number;
  height: number;
  /** Label size in viewBox units. */
  font: number;
  radius: number;
  /** Hyperspectral encoder, input layer first. */
  hs: Layer[];
  /** LiDAR encoder, input layer first. */
  li: Layer[];
  /** Layers after the two streams join. */
  trunk: Layer[];
  out: Layer;
  labelX: number;
  notes: { x: number; y: number; text: string; anchor?: "middle" }[];
};

/** `count` evenly spaced y positions centred on `center`. */
const column = (count: number, center: number, gap: number): number[] =>
  Array.from({ length: count }, (_, i) => center + (i - (count - 1) / 2) * gap);

const CLASSES = [
  "Grass",
  "Trees",
  "Water",
  "Residential",
  "Road",
  "Parking lot",
];

/** The order the outputs light up in, so it doesn't just run top to bottom. */
const LIGHT_ORDER = [2, 0, 4, 1, 5, 3];

/** Seconds between one layer firing and the next. */
const STEP = 0.2;
/** Seconds per wave. Matches the 1.6s animations in globals.css. */
const WAVE = 1.6;

const WIDE: Spec = {
  width: 1000,
  height: 400,
  font: 14,
  radius: 6.5,
  hs: [
    { x: 60, ys: column(6, 142, 34) },
    { x: 215, ys: column(5, 142, 38) },
    { x: 370, ys: column(4, 150, 40) },
  ],
  li: [
    { x: 60, ys: column(2, 318, 34) },
    { x: 215, ys: column(3, 318, 32) },
    { x: 370, ys: column(2, 312, 36) },
  ],
  trunk: [
    { x: 525, ys: column(5, 205, 42) },
    { x: 680, ys: column(4, 205, 46) },
  ],
  out: { x: 830, ys: column(6, 205, 46) },
  labelX: 852,
  notes: [
    { x: 40, y: 28, text: "Hyperspectral" },
    { x: 40, y: 380, text: "LiDAR" },
    { x: 292, y: 28, text: "Encoders", anchor: "middle" },
    { x: 602, y: 28, text: "Fusion", anchor: "middle" },
    { x: 830, y: 28, text: "Class", anchor: "middle" },
  ],
};

const COMPACT: Spec = {
  width: 360,
  height: 380,
  font: 12,
  radius: 6,
  hs: [
    { x: 24, ys: column(5, 124, 30) },
    { x: 98, ys: column(4, 128, 34) },
  ],
  li: [
    { x: 24, ys: column(2, 300, 30) },
    { x: 98, ys: column(2, 296, 34) },
  ],
  trunk: [{ x: 172, ys: column(4, 205, 40) }],
  out: { x: 240, ys: column(6, 205, 40) },
  labelX: 256,
  notes: [
    { x: 10, y: 30, text: "Hyperspectral" },
    { x: 10, y: 360, text: "LiDAR" },
  ],
};

type Edge = {
  key: string;
  d: string;
  stream: Stream;
  delay: number;
  animated: boolean;
};

/** Every connection between two neighbouring layers. */
function connect(
  from: Layer,
  to: Layer,
  stream: Stream,
  step: number,
  tag: string,
): Edge[] {
  const edges: Edge[] = [];
  from.ys.forEach((y1, i) => {
    to.ys.forEach((y2, j) => {
      // A fixed pattern, not Math.random(), so server and browser agree.
      const seed = i * 7 + j * 13 + step * 5;
      edges.push({
        key: `${tag}-${i}-${j}`,
        d: `M${from.x} ${y1}L${to.x} ${y2}`,
        stream,
        delay: step * STEP + ((seed * 37) % 10) / 80,
        animated: seed % 2 === 0,
      });
    });
  });
  return edges;
}

const PULSE_COLOUR: Record<Stream, string> = {
  hs: "stroke-ch1",
  li: "stroke-bone",
  fused: "stroke-ch1-hi",
};

const NODE_COLOUR: Record<Stream, string> = {
  hs: "fill-ch1",
  li: "fill-bone",
  fused: "fill-ch1-hi",
};

function Network({ spec, className }: { spec: Spec; className: string }) {
  const depth = spec.hs.length;
  const outStep = depth + spec.trunk.length;

  const edges: Edge[] = [];
  for (let i = 0; i < depth - 1; i++) {
    edges.push(...connect(spec.hs[i], spec.hs[i + 1], "hs", i, `hs${i}`));
    edges.push(...connect(spec.li[i], spec.li[i + 1], "li", i, `li${i}`));
  }
  edges.push(
    ...connect(spec.hs[depth - 1], spec.trunk[0], "hs", depth - 1, "hsf"),
    ...connect(spec.li[depth - 1], spec.trunk[0], "li", depth - 1, "lif"),
  );
  spec.trunk.forEach((layer, i) => {
    const next = spec.trunk[i + 1] ?? spec.out;
    edges.push(...connect(layer, next, "fused", depth + i, `t${i}`));
  });

  const nodes: { x: number; y: number; stream: Stream; step: number }[] = [];
  spec.hs.forEach((layer, step) =>
    layer.ys.forEach((y) => nodes.push({ x: layer.x, y, stream: "hs", step })),
  );
  spec.li.forEach((layer, step) =>
    layer.ys.forEach((y) => nodes.push({ x: layer.x, y, stream: "li", step })),
  );
  spec.trunk.forEach((layer, i) =>
    layer.ys.forEach((y) =>
      nodes.push({ x: layer.x, y, stream: "fused", step: depth + i }),
    ),
  );

  return (
    <svg
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      className={className}
      role="img"
      aria-label="Animated schematic of a fusion network. Hyperspectral and LiDAR inputs each pass through their own encoder, join in the fusion layers, and end in land-cover classes: grass, trees, water, residential, road and parking lot."
    >
      {/* Connections, then the signals travelling along some of them. */}
      <g
        fill="none"
        strokeWidth="1"
        className="stroke-ink-ruleHi"
        opacity="0.6"
      >
        {edges.map((edge) => (
          <path key={edge.key} d={edge.d} />
        ))}
      </g>
      <g fill="none" strokeWidth="1.75" strokeLinecap="round">
        {edges
          .filter((edge) => edge.animated)
          .map((edge) => (
            <path
              key={edge.key}
              d={edge.d}
              pathLength={100}
              className={`nn-pulse ${PULSE_COLOUR[edge.stream]}`}
              style={{ animationDelay: `${edge.delay.toFixed(2)}s` }}
            />
          ))}
      </g>

      {/* Neurons. */}
      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <circle
            cx={node.x}
            cy={node.y}
            r={spec.radius}
            strokeWidth="1"
            className="fill-ink-void stroke-bone-faint"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={spec.radius - 2.5}
            className={`nn-node ${NODE_COLOUR[node.stream]}`}
            style={{ animationDelay: `${(node.step * STEP).toFixed(2)}s` }}
          />
        </g>
      ))}

      {/* Outputs: one class lights per wave. */}
      {spec.out.ys.map((y, index) => {
        const delay = `${(outStep * STEP + 0.3 + LIGHT_ORDER[index] * WAVE).toFixed(2)}s`;
        const rest = LIGHT_ORDER[index] === 0 ? "" : undefined;
        return (
          <g key={CLASSES[index]}>
            <circle
              cx={spec.out.x}
              cy={y}
              r={spec.radius + 1.5}
              strokeWidth="1"
              className="fill-ink-void stroke-bone-faint"
            />
            <circle
              cx={spec.out.x}
              cy={y}
              r={spec.radius + 1.5}
              className="nn-out fill-ch1"
              data-rest={rest}
              style={{ animationDelay: delay }}
            />
            <text
              x={spec.labelX}
              y={y}
              dominantBaseline="central"
              fontSize={spec.font}
              letterSpacing="0.1em"
              className="nn-label font-mono uppercase"
              data-rest={rest}
              style={{ animationDelay: delay }}
            >
              {CLASSES[index]}
            </text>
          </g>
        );
      })}

      {spec.notes.map((note) => (
        <text
          key={note.text}
          x={note.x}
          y={note.y}
          textAnchor={note.anchor}
          fontSize={spec.font}
          letterSpacing="0.1em"
          className="fill-bone-muted font-mono uppercase"
        >
          {note.text}
        </text>
      ))}
    </svg>
  );
}

/**
 * `compact` always draws the narrow version, for when the figure sits in a
 * side column rather than across the page.
 */
export default function FusionNetwork({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <figure>
      <PlayInView className="nn frame bg-ink-panel/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-meta text-ch1">Fusion network</p>
          <p className="label text-bone-faint">Two sensors in, one label out</p>
        </div>
        {compact ? (
          <Network spec={COMPACT} className="mt-3 h-auto w-full" />
        ) : (
          <>
            <Network
              spec={COMPACT}
              className="mx-auto mt-4 h-auto w-full max-w-md lg:hidden"
            />
            <Network
              spec={WIDE}
              className="mt-4 hidden h-auto w-full lg:block"
            />
          </>
        )}
      </PlayInView>
      <figcaption className="mt-3 max-w-prose text-meta leading-relaxed text-bone-faint">
        A schematic of the idea, not the exact layers of any one model.
      </figcaption>
    </figure>
  );
}
