import { Link } from "react-router-dom";
import { BrandTitle } from "@/components/BrandTitle";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
    <p className="mb-2 font-display text-8xl font-black text-neon-cyan">404</p>
    <h1 className="mb-3 font-display text-2xl font-bold">Страница не найдена</h1>
    <p className="mb-8 max-w-sm text-muted-foreground">
      Возможно, она была перемещена или вы перешли по устаревшей ссылке.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-lg border border-neon-cyan px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-neon-cyan transition-colors hover:bg-neon-cyan/10"
    >
      На главную
    </Link>
    <div className="mt-12 opacity-30">
      <BrandTitle className="text-sm" />
    </div>
  </div>
);

export default NotFound;
