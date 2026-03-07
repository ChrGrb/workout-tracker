<script lang="ts">
  import { lightenDarkenColor } from "$lib/utils/lightenDarkenColor";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { ExerciseTypeArea } from "@prisma/client";

  interface Props {
    areas: Record<ExerciseTypeArea, number>;
  }

  let { areas }: Props = $props();

  // Configuration
  const segmentsPerBar = 4;
  const size = 280;
  const center = size / 2;
  const columnGap = 7; // This stays 2px regardless of radius
  const segmentGap = 6;
  const cornerRadius = 4;

  const innerGapRadius = 12;
  const ringSize = 13;

  const labelRadius =
    (ringSize + segmentGap) * (segmentsPerBar + 2) + segmentGap;

  const colorLighteningValues = [80, 60, 40, 0];

  let muscleData = [
    {
      name: "Chest",
      value: areas[ExerciseTypeArea.CHEST] ?? 0,
      color: "#2dd4bf",
    },
    {
      name: "Back",
      value: areas[ExerciseTypeArea.BACK] ?? 0,
      color: "#4ade80",
    },
    {
      name: "Legs",
      value: areas[ExerciseTypeArea.LEGS] ?? 0,
      color: "#38bdf8",
    },
    {
      name: "Shoulders",
      value: areas[ExerciseTypeArea.SHOULDERS] ?? 0,
      color: "#86efac",
    },
    {
      name: "Core",
      value: areas[ExerciseTypeArea.CORE] ?? 0,
      color: "#bef264",
    },
    {
      name: "Arms",
      value: areas[ExerciseTypeArea.ARMS] ?? 0,
      color: "#a3e635",
    },
  ];

  const totalSlots = muscleData.length;
  const slotAngle = 360 / totalSlots;

  const maxValue = Math.max(...muscleData.map((muscle) => muscle.value));
  const totalValue = muscleData
    .map((muscle) => muscle.value)
    .reduce(function (a, b) {
      return a + b;
    });

  const isLit = (barValue, segmentIndex) => {
    const threshold = segmentIndex * (maxValue / segmentsPerBar);
    return barValue > threshold;
  };

  const radiansToDegrees = (degrees: number) => degrees * (180 / Math.PI);

  const degreesToRadians = (deg) => (deg - 90) * (Math.PI / 180);

  const getCoords = (angle: number, radius: number) => ({
    x: center + radius * Math.cos(degreesToRadians(angle)),
    y: center + radius * Math.sin(degreesToRadians(angle)),
  });

  // Here is a helper to create the path for ONE segment block:
  function getSegmentPath(muscleIndex, ringIndex) {
    const innerRadius = innerGapRadius + ringIndex * (ringSize + segmentGap);
    const outerRadius = innerRadius + ringSize;

    const centerAngle = muscleIndex * slotAngle;

    const startAngleInner =
      centerAngle + radiansToDegrees(columnGap / innerRadius) / 2;
    const endAngleInner =
      centerAngle + slotAngle - radiansToDegrees(columnGap / innerRadius) / 2;

    const startAngleOuter =
      centerAngle + radiansToDegrees(columnGap / outerRadius) / 2;
    const endAngleOuter =
      centerAngle + slotAngle - radiansToDegrees(columnGap / outerRadius) / 2;

    // Corner Points
    const p1 = getCoords(startAngleInner, innerRadius);
    const p2 = getCoords(startAngleOuter, outerRadius);
    const p3 = getCoords(endAngleOuter, outerRadius);
    const p4 = getCoords(endAngleInner, innerRadius);

    return `M ${p1.x} ${p1.y} 
            L ${p2.x} ${p2.y} 
            A ${outerRadius} ${outerRadius} 0 0 1 ${p3.x} ${p3.y} 
            L ${p4.x} ${p4.y} 
            A ${innerRadius} ${innerRadius} 0 0 0 ${p1.x} ${p1.y} Z`;
  }

  const getLabelCoords = (index) => {
    // The label should be in the middle of the slice
    const angle = index * slotAngle + slotAngle / 2;
    // Reuse your existing getCoords function
    return getCoords(angle, labelRadius);
  };
</script>

<svg viewBox={`0 0 ${size} ${size}`} class="w-full h-full p-4">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="0.2" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <g>
    {#each muscleData as muscle, i}
      {#each Array(segmentsPerBar) as _, j}
        {@const lit = isLit(muscle.value, j)}

        <path
          d={getSegmentPath(i, j)}
          fill={lit
            ? lightenDarkenColor(
                muscle.color,
                isLit(muscle.value, j + 1) ? colorLighteningValues[j] : 0,
              )
            : "#e2e8f0"}
          stroke-linejoin="round"
          stroke-width={cornerRadius}
          stroke={lit
            ? lightenDarkenColor(
                muscle.color,
                isLit(muscle.value, j + 1) ? colorLighteningValues[j] : 0,
              )
            : "#e2e8f0"}
          style="--shadow-color: {muscle.color}; filter: url(#glow);"
          class="transition-all duration-500 ease-out"
        />
      {/each}
    {/each}

    {#each muscleData as muscle, i}
      {@const pos = getLabelCoords(i)}
      {@const value = Math.round((muscle.value / totalValue) * 100)}

      <foreignObject
        x={pos.x - 15}
        y={pos.y - 20}
        width="30"
        height="20"
        class="overflow-visible"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <span
            class="text-[18px] font-bold leading-none transition-colors duration-300"
            style="color: {muscle.color}"
          >
            {!isNaN(value) ? value : 0}%
          </span>

          <span
            class="text-[16px] uppercase tracking-tighter text-slate-400 font-medium"
          >
            {muscle.name}
          </span>
        </div>
      </foreignObject>
    {/each}
  </g>
</svg>
