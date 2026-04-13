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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-lg font-bold">
          <BrandTitle uppercase />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {beforeConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-medium text-foreground/70 hover:text-neon-cyan transition-colors">
              {item.label}
            </button>
          )}
          <Link
            to="/conference"
            className="text-sm font-medium text-foreground/70 hover:text-neon-cyan transition-colors">
            Конференция
          </Link>
          {afterConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-medium text-foreground/70 hover:text-neon-cyan transition-colors">
              {item.label}
            </button>
          )}
        </div>
        <button
          onClick={() => scrollToSection("#research")}
          className="hidden md:inline-flex px-6 py-2 bg-neon-magenta text-primary-foreground font-semibold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm">
          Получить исследование
        </button>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open &&
        <div className="md:hidden bg-background border-t border-border p-4 space-y-3">
          {beforeConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="block text-sm text-foreground/70 hover:text-neon-cyan text-left w-full">
              {item.label}
            </button>
          )}
          <Link
            to="/conference"
            onClick={() => setOpen(false)}
            className="block text-sm text-foreground/70 hover:text-neon-cyan text-left w-full">
            Конференция
          </Link>
          {afterConference.map((item) =>
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="block text-sm text-foreground/70 hover:text-neon-cyan text-left w-full">
              {item.label}
            </button>
          )}
          <button
            onClick={() => scrollToSection("#research")}
            className="block text-center px-6 py-2 bg-neon-magenta text-primary-foreground font-semibold rounded-lg text-sm w-full">
            Получить исследование
          </button>
        </div>
      }
    </nav>);
};
