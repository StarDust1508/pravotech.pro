import { useId } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3, ArrowRight } from "lucide-react";
import type { ResearchChart } from "@/lib/api";

/* ── Palette ── */
const CYAN = "hsl(180 100% 50%)";
const CYAN_DIM = "hsl(180 60% 40%)";
const MAGENTA = "hsl(320 100% 60%)";
const MAGENTA_DIM = "hsl(320 60% 45%)";

const PIE_PALETTE = [
  CYAN,
  MAGENTA,
  "hsl(45 90% 55%)",     // amber
  "hsl(160 60% 45%)",    // emerald
  "hsl(270 60% 60%)",    // purple
  "hsl(200 70% 55%)",    // sky
];

const BAR_PALETTE = [
  CYAN, "hsl(180 80% 45%)", "hsl(180 60% 40%)", "hsl(180 50% 35%)",
  MAGENTA, "hsl(320 80% 50%)", "hsl(320 60% 45%)", "hsl(320 50% 40%)",
  "hsl(45 90% 55%)", "hsl(160 60% 45%)",
];

const LABEL_COLOR = "rgba(255,255,255,0.6)";

const axisStyle = { fill: LABEL_COLOR, fontSize: 11, fontFamily: "inherit" };

const tooltipStyle = {
  background: "rgba(10, 10, 18, 0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  fontSize: 12,
  color: "rgba(255,255,255,0.85)",
  padding: "10px 14px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  backdropFilter: "blur(12px)",
};

const tooltipLabelStyle = { color: LABEL_COLOR, marginBottom: 4, fontWeight: 600 };
const tooltipItemStyle = { color: "rgba(255,255,255,0.9)" };

/* ── Gradient defs component ── */
function GradientDefs({ id, type }: { id: string; type: "cyan" | "magenta" }) {
  const c1 = type === "cyan" ? CYAN : MAGENTA;
  const c2 = type === "cyan" ? CYAN_DIM : MAGENTA_DIM;
  return (
    <defs>
      <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={c1} stopOpacity={0.9} />
        <stop offset="100%" stopColor={c2} stopOpacity={0.6} />
      </linearGradient>
      <linearGradient id={`${id}-barh`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={c2} stopOpacity={0.6} />
        <stop offset="100%" stopColor={c1} stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={c1} stopOpacity={0.25} />
        <stop offset="100%" stopColor={c1} stopOpacity={0} />
      </linearGradient>
      <filter id={`${id}-glow`}>
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/* ── Chart Card ── */
function ChartCard({ chart, index }: { chart: ResearchChart; index: number }) {
  const unit = chart.unit ?? "";
  const gId = useId();
  const isMagenta = index % 2 === 1;
  const accentType = isMagenta ? "magenta" : "cyan";
  const accent = isMagenta ? MAGENTA : CYAN;
  const borderClass = isMagenta
    ? "border-neon-magenta/15 hover:border-neon-magenta/30"
    : "border-neon-cyan/15 hover:border-neon-cyan/30";
  const glowClass = isMagenta
    ? "from-neon-magenta/[0.03]"
    : "from-neon-cyan/[0.03]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border ${borderClass} bg-card/80 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 relative overflow-hidden group`}
    >
      {/* Subtle gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowClass} to-transparent pointer-events-none`} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isMagenta ? "bg-neon-magenta/10" : "bg-neon-cyan/10"
          }`}>
            <BarChart3 size={14} className={isMagenta ? "text-neon-magenta" : "text-neon-cyan"} />
          </div>
          <h3 className="font-display text-sm font-bold leading-snug text-foreground/90">
            {chart.title}
          </h3>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "bar" ? (
              <BarChart data={chart.data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <GradientDefs id={gId} type={accentType} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} interval={0} angle={chart.data.length > 6 ? -30 : 0} textAnchor={chart.data.length > 6 ? "end" : "middle"} height={chart.data.length > 6 ? 60 : 30} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} formatter={(v) => [`${v}${unit}`, ""]} />
                <Bar dataKey="value" fill={`url(#${gId}-bar)`} radius={[6, 6, 0, 0]} animationDuration={800} animationBegin={200}>
                  {chart.data.map((_, i) => (
                    <Cell key={i} fill={chart.data.length > 4 ? BAR_PALETTE[i % BAR_PALETTE.length] : `url(#${gId}-bar)`} />
                  ))}
                </Bar>
              </BarChart>
            ) : chart.type === "barh" ? (
              <BarChart layout="vertical" data={chart.data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <GradientDefs id={gId} type={accentType} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ ...axisStyle, fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} formatter={(v) => [`${v}${unit}`, ""]} />
                <Bar dataKey="value" fill={`url(#${gId}-barh)`} radius={[0, 6, 6, 0]} animationDuration={800} animationBegin={200}>
                  {chart.data.map((_, i) => (
                    <Cell key={i} fill={BAR_PALETTE[i % BAR_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : chart.type === "line" ? (
              <AreaChart data={chart.data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <GradientDefs id={gId} type={accentType} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={(v) => [`${v}${unit}`, ""]} />
                <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2.5} fill={`url(#${gId}-area)`} dot={{ r: 5, fill: accent, stroke: "rgba(10,10,18,0.8)", strokeWidth: 2 }} activeDot={{ r: 7, fill: accent, filter: `url(#${gId}-glow)` }} animationDuration={1000} />
              </AreaChart>
            ) : (
              /* PIE */
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={(v) => [`${v}${unit}`, ""]} />
                <Pie
                  data={chart.data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={3}
                  cornerRadius={4}
                  strokeWidth={0}
                  animationDuration={800}
                  animationBegin={200}
                  label={false}
                >
                  {chart.data.map((_, i) => (
                    <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Pie legend — below chart */}
        {chart.type === "pie" && (
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {chart.data.map((d, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PIE_PALETTE[i % PIE_PALETTE.length] }}
                />
                <span className="text-[11px] text-foreground/55 truncate">
                  {d.label}
                </span>
                <span className="text-[11px] font-bold text-foreground/70 ml-auto flex-shrink-0">
                  {d.value}{unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        {chart.note && (
          <p className="text-[11px] text-foreground/35 mt-4 leading-relaxed italic">
            {chart.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Steps Card ── */
function StepsCard({ chart, index }: { chart: ResearchChart; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-neon-cyan/15 bg-card/80 backdrop-blur-sm p-5 md:p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/[0.02] to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
            <ArrowRight size={14} className="text-neon-cyan" />
          </div>
          <h3 className="font-display text-sm font-bold leading-snug text-foreground/90">
            {chart.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {chart.data.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.04] px-4 py-2.5 hover:border-neon-cyan/40 hover:bg-neon-cyan/[0.08] transition-all">
                <span className="w-6 h-6 rounded-full bg-neon-cyan/15 flex items-center justify-center font-display text-[11px] font-black text-neon-cyan">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground/80">{step.label}</span>
              </div>
              {i < chart.data.length - 1 && (
                <ArrowRight size={16} className="text-neon-magenta/40 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {chart.note && (
          <p className="text-[11px] text-foreground/35 mt-4 leading-relaxed italic">
            {chart.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main export ── */
export function ResearchCharts({ charts }: { charts: ResearchChart[] }) {
  if (!charts?.length) return null;
  return (
    <div className="mb-10">
      <div className="grid sm:grid-cols-2 gap-5">
        {charts.map((c, i) => {
          const fullWidth = c.type === "steps" || c.type === "barh" || (charts.length % 2 === 1 && i === charts.length - 1);
          return (
            <div key={i} className={fullWidth ? "sm:col-span-2" : ""}>
              {c.type === "steps" ? <StepsCard chart={c} index={i} /> : <ChartCard chart={c} index={i} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
