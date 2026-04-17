import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BrandTitle } from "@/components/BrandTitle";

const beforeConference = [
  { label: "О проекте", href: "#about" },
  { label: "Исследования", href: "#research" },
  { label: "Академия", href: "#academy" },
];

const afterConference = [
  { label: "Контакты", href: "#contacts" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (href: string) => {
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setOpen(false);
  };

  const navLinkClass = "relative text-[13px] font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neon-cyan after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="container flex items-center justify-between h-14">
        {/* Brand block */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-display text-lg font-black tracking-tight">
            <BrandTitle uppercase />
          </span>
          <span className="hidden lg:block text-[10px] uppercase tracking-[0.15em] text-foreground/30 font-medium border-l border-white/10 pl-3 leading-tight">
            Legal Tech<br />платформа
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {beforeConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className={navLinkClass}
            >
              {item.label}
            </button>
          )}
          <Link to="/conference" className={navLinkClass}>
            Конференция
          </Link>
          {afterConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className={navLinkClass}
            >
              {item.label}
            </button>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollToSection("#research")}
          className="hidden md:inline-flex items-center px-5 py-2 bg-neon-magenta/90 text-primary-foreground font-display font-bold rounded-md hover:bg-neon-magenta transition-colors text-xs uppercase tracking-wider"
        >
          Получить исследование
        </button>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground/70" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open &&
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-white/[0.06] px-6 py-5 space-y-4">
          {beforeConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="block text-sm text-foreground/60 hover:text-foreground text-left w-full transition-colors"
            >
              {item.label}
            </button>
          )}
          <Link
            to="/conference"
            onClick={() => setOpen(false)}
            className="block text-sm text-foreground/60 hover:text-foreground text-left w-full transition-colors"
          >
            Конференция
          </Link>
          {afterConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="block text-sm text-foreground/60 hover:text-foreground text-left w-full transition-colors"
            >
              {item.label}
            </button>
          )}
          <button
            onClick={() => scrollToSection("#research")}
            className="block text-center w-full px-5 py-2.5 bg-neon-magenta/90 text-primary-foreground font-display font-bold rounded-md text-xs uppercase tracking-wider mt-2"
          >
            Получить исследование
          </button>
        </div>
      }
    </nav>
  );
};
