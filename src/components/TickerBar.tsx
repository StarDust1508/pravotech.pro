const items = [
  "Аналитика БФЛ",
  "AI в праве",
  "Банкротство физлиц",
  "LegalTech",
  "Арбитражное управление",
  "Чек-листы",
  "Курсы",
  `Конференция ${new Date().getFullYear()}`,
];

export const TickerBar = () => {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      role="marquee"
      aria-label="Направления проекта"
      className="relative overflow-hidden border-y border-neon-cyan/10 py-3.5 bg-card/30"
    >
      <div className="flex whitespace-nowrap animate-ticker motion-reduce:animate-none">
        {repeated.map((item, i) => (
          <span key={i} className="mx-8 text-[13px] font-medium text-foreground/40 uppercase tracking-[0.15em]">
            {item}
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};
