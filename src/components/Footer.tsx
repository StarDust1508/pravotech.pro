export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-lg font-bold text-neon-cyan">LEGAL</span>
            <span className="font-display text-lg font-bold text-neon-magenta">TECH</span>
            <p className="text-muted-foreground text-sm mt-1">Технологии в сфере права • 2026</p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#streams" className="hover:text-neon-cyan transition-colors">Потоки</a>
            <a href="#exhibition" className="hover:text-neon-cyan transition-colors">Выставка</a>
            <a href="#sponsors" className="hover:text-neon-cyan transition-colors">Спонсорам</a>
            <a href="#become-speaker" className="hover:text-neon-cyan transition-colors">Спикерам</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 LegalTech Conference. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
