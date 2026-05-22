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
} from "recharts";
import type { ResearchChart } from "@/lib/api";

const CYAN = "hsl(180 100% 50%)";
const MAGENTA = "hsl(320 100% 60%)";
const PIE_PALETTE = [CYAN, MAGENTA, "hsl(180 30% 55%)", "hsl(320 30% 60%)"];

const axisStyle = { fill: "hsl(var(--muted-foreground))", fontSize: 12 };

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

function ChartCard({ chart }: { chart: ResearchChart }) {
  const unit = chart.unit ?? "";
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4">
        {chart.title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "bar" ? (
            <BarChart data={chart.data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} formatter={(v) => [`${v}${unit}`, ""]} />
              <Bar dataKey="value" fill={CYAN} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chart.type === "barh" ? (
            <BarChart layout="vertical" data={chart.data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} formatter={(v) => [`${v}${unit}`, ""]} />
              <Bar dataKey="value" fill={CYAN} radius={[0, 4, 4, 0]} />
            </BarChart>
          ) : chart.type === "line" ? (
            <LineChart data={chart.data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit}`, ""]} />
              <Line type="monotone" dataKey="value" stroke={MAGENTA} strokeWidth={2.5} dot={{ r: 4, fill: MAGENTA }} />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}${unit}`, ""]} />
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={2}
                label={(e: { label?: string; value?: number }) => `${e.label}: ${e.value}${unit}`}
                labelLine={false}
                fontSize={11}
              >
                {chart.data.map((_, i) => (
                  <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      {chart.note && <p className="text-xs text-muted-foreground mt-3">{chart.note}</p>}
    </div>
  );
}

function StepsCard({ chart }: { chart: ResearchChart }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4">
        {chart.title}
      </h3>
      <div className="flex flex-wrap items-stretch gap-2">
        {chart.data.map((step, i) => (
          <div key={i} className="flex items-stretch gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-2">
              <span className="font-display text-xs font-bold text-neon-cyan">{i + 1}</span>
              <span className="text-sm">{step.label}</span>
            </div>
            {i < chart.data.length - 1 && (
              <span className="self-center text-neon-magenta">→</span>
            )}
          </div>
        ))}
      </div>
      {chart.note && <p className="text-xs text-muted-foreground mt-3">{chart.note}</p>}
    </div>
  );
}

export function ResearchCharts({ charts }: { charts: ResearchChart[] }) {
  if (!charts?.length) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-10">
      {charts.map((c, i) => {
        const fullWidth = c.type === "steps" || (charts.length % 2 === 1 && i === charts.length - 1);
        return (
          <div key={i} className={fullWidth ? "sm:col-span-2" : ""}>
            {c.type === "steps" ? <StepsCard chart={c} /> : <ChartCard chart={c} />}
          </div>
        );
      })}
    </div>
  );
}
