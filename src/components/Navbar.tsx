import { useState } from "react";
import { Menu, X, Sparkles, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BrandTitle } from "@/components/BrandTitle";
import { useUserProfile } from "@/hooks/useUserProfile";

const navItems = [
  { label: "Исследования", to: "/research" },
  { label: "Чек‑листы", to: "/checklists" },
  { label: "Платформа", to: "/platform" },
  { label: "Книга", to: "/book" },
  { label: "Академия", to: "/academy" },
  { label: "Конференция", to: "/conference" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { name, greeting } = useUserProfile();

  const isActive = (to: string) => location.pathname === to;
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="container flex items-center justify-between h-[88px]">
        {/* Brand — крупнее */}
        <Link
          to="/"
          onClick={() => {
            if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
          }}
          className="relative flex items-center gap-2.5 group flex-shrink-0"
        >
          <span className="font-display text-xl md:text-2xl font-black tracking-tight whitespace-nowrap">
            <BrandTitle uppercase />
          </span>
          {isHome && (
            <motion.div
              layoutId="nav-active"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </Link>

        {/* Desktop nav — увеличенный шрифт */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-4 py-2.5 text-[16px] font-semibold transition-colors duration-200 rounded-lg group whitespace-nowrap overflow-hidden"
            >
              <motion.span
                className={`relative z-10 ${isActive(item.to) ? "text-foreground" : "text-foreground/50 group-hover:text-foreground"}`}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {item.label}
              </motion.span>
              {isActive(item.to) && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-neon-cyan rounded-full shadow-[0_0_8px_hsl(180_100%_50%/0.5)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side: greeting + profile icon */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {name && (
            <span className="text-[13px] text-foreground/45 font-medium">
              {greeting}, <span className="text-neon-cyan">{name}</span>
            </span>
          )}
          <Link
            to="/profile"
            className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all group"
            aria-label="Профиль"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan/70 group-hover:text-neon-cyan transition-colors" />
            <User className="w-4.5 h-4.5 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground/70 p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-t border-white/[0.06]"
          >
            <div className="px-6 py-6 space-y-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-[17px] font-semibold transition-colors ${
                      isActive(item.to)
                        ? "text-neon-cyan bg-neon-cyan/5"
                        : "text-foreground/60 hover:text-foreground hover:bg-white/[0.03]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {/* Mobile profile link */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.04 + 0.05 }}
                className="pt-3"
              >
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan font-display font-bold text-sm uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <User className="w-4 h-4" />
                  <span>{name ? name : "Профиль"}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
