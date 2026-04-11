import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Profile", to: "/" },
  { label: "Reviews", to: "/reviews" },
  { label: "About", to: "/about" },
];

const ROUTE_TO_LABEL = {
  "/": "Profile",
  "/reviews": "Reviews",
  "/about": "About",
};

const PILL_TRANSITION = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.7,
};

const SCROLL_FLAG_KEY = "aleksandar-nav-scroll-top";

export default function NavBar() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [isHidden, setIsHidden] = useState(false);
  const [observedActive, setObservedActive] = useState(null);
  const frameRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const isFirstPathRenderRef = useRef(true);

  const routeActive = useMemo(
    () => ROUTE_TO_LABEL[location.pathname] ?? null,
    [location.pathname],
  );

  const activeLabel = observedActive ?? routeActive;

  useEffect(() => {
    const updateNavbarState = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const delta = currentScrollY - lastScrollYRef.current;
      const isAtTop = currentScrollY <= 12;

      if (isAtTop) {
        setIsHidden(false);
      } else if (delta > 8 && currentScrollY > 96) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      frameRef.current = 0;
    };

    const handleScroll = () => {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateNavbarState);
    };

    lastScrollYRef.current = window.scrollY || window.pageYOffset || 0;
    updateNavbarState();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setObservedActive(null);
      return undefined;
    }

    const sections = Array.from(document.querySelectorAll("[data-nav-section]"));

    if (!sections.length) {
      setObservedActive(null);
      return undefined;
    }

    const visibleScores = new Map();

    const syncActiveSection = () => {
      let nextLabel = null;
      let nextScore = 0;

      for (const [label, score] of visibleScores.entries()) {
        if (score > nextScore) {
          nextLabel = label;
          nextScore = score;
        }
      }

      setObservedActive(nextLabel);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const label = entry.target.getAttribute("data-nav-section");

          if (!label) {
            return;
          }

          visibleScores.set(label, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        syncActiveSection();
      },
      {
        threshold: [0.15, 0.3, 0.45, 0.6, 0.75],
        rootMargin: "-18% 0px -52% 0px",
      },
    );

    sections.forEach((section) => {
      const label = section.getAttribute("data-nav-section");

      if (label) {
        visibleScores.set(label, 0);
      }

      observer.observe(section);
    });

    syncActiveSection();

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isFirstPathRenderRef.current) {
      isFirstPathRenderRef.current = false;
      return;
    }

    let shouldSmoothScroll = false;

    try {
      shouldSmoothScroll = window.sessionStorage.getItem(SCROLL_FLAG_KEY) === "1";
      window.sessionStorage.removeItem(SCROLL_FLAG_KEY);
    } catch {
      shouldSmoothScroll = false;
    }

    const scrollBehavior = shouldSmoothScroll && !shouldReduceMotion ? "smooth" : "auto";
    const rafId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [location.pathname, shouldReduceMotion]);

  const handleNavClick = (event, item) => {
    if (location.pathname === item.to) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
      return;
    }

    try {
      window.sessionStorage.setItem(SCROLL_FLAG_KEY, "1");
    } catch {
      // Ignore storage access issues and fall back to default navigation.
    }
  };

  return (
    <>
      <div className="h-[72px] print:hidden md:h-[88px]" aria-hidden="true" />

      <motion.div
        className="fixed inset-x-0 top-0 z-40 print:hidden"
        initial={false}
        animate={{ y: shouldReduceMotion || !isHidden ? 0 : -38 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 360, damping: 34, mass: 0.7 }
        }
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-2 pt-4 md:px-12 md:pt-6">
          <div className="flex justify-center">
            <nav className="relative flex items-center gap-1 rounded-2xl border border-cyan-400/15 bg-[#041a1f]/72 px-2 py-1.5 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              {NAV_ITEMS.map((item) => {
                const isActive = activeLabel === item.label;

                return (
                  <motion.div
                    key={item.label}
                    whileHover={shouldReduceMotion ? undefined : { y: -1, scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    <Link
                      to={item.to}
                      onClick={(event) => handleNavClick(event, item)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative block overflow-hidden rounded-xl px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-cyan-50"
                          : "text-cyan-200/55 hover:bg-cyan-500/10 hover:text-cyan-200/90 active:bg-cyan-500/15"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 rounded-xl border border-cyan-300/20 bg-cyan-500/20 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_10px_30px_rgba(6,182,212,0.16)]"
                          transition={PILL_TRANSITION}
                        />
                      ) : null}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.div>
    </>
  );
}
