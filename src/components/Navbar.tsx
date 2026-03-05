import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
{ label: "Потоки", href: "#streams" },
{ label: "Спикеры", href: "#speakers" },
{ label: "Выставка", href: "#exhibition" },
{ label: "Спонсорам", href: "#sponsors" },
{ label: "Стать спикером", href: "#become-speaker" }];


export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="font-display text-lg font-bold text-neon-cyan">
          ТЕХНОЛОГИИ <span className="text-neon-magenta">ПРАВА</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-foreground/70 hover:text-neon-cyan transition-colors">
            
              {item.label}
            </a>
          )}
        </div>
        <a
          href="#register"
          className="hidden md:inline-flex px-6 py-2 bg-neon-magenta text-primary-foreground font-semibold rounded-lg shadow-neon-magenta hover:opacity-90 transition-opacity text-sm">
          
          Получить билет
        </a>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open &&
      <div className="md:hidden bg-background border-t border-border p-4 space-y-3">
          {navItems.map((item) =>
        <a
          key={item.href}
          href={item.href}
          className="block text-sm text-foreground/70 hover:text-neon-cyan"
          onClick={() => setOpen(false)}>
          
              {item.label}
            </a>
        )}
          <a
          href="#register"
          className="block text-center px-6 py-2 bg-neon-magenta text-primary-foreground font-semibold rounded-lg text-sm"
          onClick={() => setOpen(false)}>
          
            Получить билет
          </a>
        </div>
      }
    </nav>);

};