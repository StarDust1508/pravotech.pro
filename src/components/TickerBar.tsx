const items = [
  "8 исследований рынка",
  "1500+ участников конференции",
  "80 спикеров",
  "6 потоков",
  "Аналитика БФЛ",
  "AI в праве",
  "Банкротство физлиц",
  "LegalTech",
];

export const TickerBar = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden bg-muted/50 border-y border-border py-3">
      <div className="flex whitespace-nowrap animate-ticker">
        {repeated.map((item, i) => (
          <span key={i} className="mx-6 text-sm font-semibold text-foreground/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
