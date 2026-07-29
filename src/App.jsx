import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "./Seo.jsx";
import { downloadCvPdf } from "./cvPdf.js";
import { profileData as data } from "./profileData.js";
import {
  Shield, Terminal, Radar, Briefcase, GraduationCap,
  Cpu, Layers, Sparkles, Search, Download, Github, Lock, ExternalLink,
  MessageCircle,
  Timer,
  SwissFranc,
  ShieldAlert,
  ShieldBan,
  Target,
  TargetIcon,
  LockIcon,
  LockOpenIcon,
} from "lucide-react";

// ── Частицы ───────────────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(34,211,238,${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 print:hidden" />;
}

// ── HoverCard — glow + подъём ─────────────────────────────────────────────────
const HoverCard = ({ children, className = "" }) => (
  <motion.div
    className={`group rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4 ${className}`}
    whileHover={{ y: -3, boxShadow: "0 0 0 1.5px rgba(34,211,238,0.3), 0 8px 32px rgba(6,182,212,0.18)" }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// ── Chip с hover ──────────────────────────────────────────────────────────────
const Chip = ({ children }) => (
  <motion.span
    className="inline-flex items-center rounded-md border border-cyan-400/15 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100/80 cursor-default"
    whileHover={{ scale: 1.08, backgroundColor: "rgba(6,182,212,0.22)", borderColor: "rgba(34,211,238,0.45)", color: "rgba(207,250,254,1)" }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.span>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-1.5 text-sm font-medium text-cyan-100">
    {children}
  </span>
);

// ── Навигация ─────────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, subtitle, children }) => (
  <motion.section
    className="rounded-2xl border border-cyan-400/10 bg-[#041a1f]/60 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4 }}
  >
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
        <Icon className="h-5 w-5 text-cyan-300" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-lg text-cyan-200/50">{subtitle}</p> : null}
      </div>
    </div>
    {children}
  </motion.section>
);

const Divider = () => <div className="my-4 h-px w-full bg-cyan-400/10" />;

const PROJECT_BACKGROUNDS = {
  "WEB-приложение": {
    desktop: "/web.png",
    mobile: "/webm.png",
  },
  "Веб-приложение для бронирования": {
    desktop: "/web2.png",
    mobile: "/webm2.png",
  },
};

export default function App() {
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.projects;
    return data.projects.filter((p) =>
      [p.name, p.desc, ...(p.bullets || []), ...(p.tags || [])].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#020d10] text-white" data-nav-section="Profile">
      <Seo
        description="Portfolio website of Aleksandar with frontend projects, technical reviews and contact information."
        path="/"
      />

      <Particles />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]" style={{ backgroundImage: "radial-gradient(circle at 15% 10%, rgba(6,182,212,0.35) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 35%, rgba(20,184,166,0.25) 0, rgba(0,0,0,0) 55%), radial-gradient(circle at 50% 95%, rgba(34,211,238,0.18) 0, rgba(0,0,0,0) 45%)" }} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.04),transparent_30%,transparent_70%,rgba(20,184,166,0.03))]" />

      {/* HEADER */}
      <header className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-6 pt-4 print:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-cyan-400/15 overflow-hidden shadow-[0_0_0_1px_rgba(6,182,212,0.08),0_24px_70px_rgba(0,0,0,0.65)]"
        >
          {/* ── ФОН ШАПКИ: раскомментируй строку ниже и вставь путь к своему фото ── */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('c.gif')" }} />
          {/* Оверлей — затемняет фото для читаемости текста, можно менять прозрачность */}
          <div className="absolute inset-0 bg-[#041a1f]/80 backdrop-blur-sm" />
          {/* Плавный градиент снизу */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d10]/60 via-transparent to-transparent" />

          <div className="relative p-4 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Shield className="mr-2 h-3.5 w-3.5" />INFOSEC PROFILE</Badge>
                <Badge><Lock className="mr-2 h-3.5 w-3.5" />SECURITY MINDED</Badge>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{data.name}</h1>
              <p className="mt-2 text-lg text-cyan-200/70 sm:text-xl md:text-2xl">{data.role}</p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">{data.tagline}</p>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-[320px] md:shrink-0 print:hidden">
              <div className="grid w-full grid-cols-1 gap-2 min-[390px]:grid-cols-2">
                <button type="button" onClick={downloadCvPdf} className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-cyan-400/30 hover:bg-cyan-500/15 sm:text-base">
                  <Download className="h-4 w-4" />Скачать CV
                </button>
                <Link to="/contact" className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-400/20 px-4 py-2.5 text-sm font-medium text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.12)] transition-all hover:border-cyan-300/60 hover:bg-cyan-400/30 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)] sm:text-base">
                  <MessageCircle className="h-4 w-4" />Связаться
                </Link>
              </div>
              <div className="w-full rounded-2xl border border-cyan-400/10 bg-[#020d10]/50 p-3 text-sm text-cyan-200/55">
                <div className="mb-2 font-medium text-cyan-100/70">Контакты</div>
                <div className="flex flex-col gap-1">
                  {data.links.map((l) => (
                    <div key={l.label} className="flex min-w-0 items-center justify-between gap-3">
                      <span className="shrink-0 text-cyan-200/45">{l.label}</span>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-right text-cyan-100/75 transition-colors hover:text-cyan-300">{l.value}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </header>

      {/* CONTACTS — только при печати */}
      <div className="hidden print:block mx-auto w-full max-w-screen-2xl px-12 pb-4">
        <div className="flex flex-wrap gap-6 rounded-2xl border border-cyan-400/15 bg-[#041a1f]/60 px-6 py-4">
          {data.links.map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-base">
              <span className="font-semibold text-cyan-300">{l.label}:</span>
              <span className="text-white/80">{l.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="relative z-10 mx-auto w-full max-w-screen-2xl grid grid-cols-1 gap-4 px-4 pb-16 md:grid-cols-12 md:px-12 print:pb-4">

        {/* LEFT */}
        <div className="md:col-span-7 flex flex-col gap-4">

          <Section icon={Briefcase} title="Опыт" subtitle="Путь в информационной безопасности">
            <div className="space-y-4">
              {data.experience.map((e) => (
                <HoverCard key={e.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xl font-semibold text-white">{e.title}</div>
                      <div className="mt-0.5 text-base text-cyan-200/60">{e.company}</div>
                    </div>
                    <div className="text-sm text-cyan-200/45">{e.period}</div>
                  </div>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-white/75">
                    {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </HoverCard>
              ))}
            </div>
          </Section>

          <Section icon={Sparkles} title="Проекты" subtitle="Практические работы и исследования">
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-500/5 px-3 py-2 print:hidden">
              <Search className="h-4 w-4 text-cyan-300/60" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по проектам (Python, GitHub, Linux...)" className="w-full bg-transparent text-base text-white/80 outline-none placeholder:text-cyan-200/35" />
            </div>
            <div className="space-y-4">
              {filteredProjects.map((p) => {
                const projectBackground = PROJECT_BACKGROUNDS[p.name];
                const isDecoratedProject = Boolean(projectBackground);
                const mobileBackground = projectBackground?.mobile;
                const desktopBackground = projectBackground?.desktop;

                return (
                <HoverCard key={p.name} className={isDecoratedProject ? "relative overflow-hidden" : ""}>
                  {isDecoratedProject && (
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <div
                        className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-[0.24] transition-opacity duration-300 group-hover:opacity-[0.38] md:hidden"
                        style={{ backgroundImage: `url('${mobileBackground}')` }}
                      />
                      <div className="project-card-desktop-image-container">
                        <img
                          src={desktopBackground}
                          alt=""
                          className="project-card-desktop-image transition-opacity duration-300 group-hover:opacity-[0.52]"
                        />
                        <div className="project-card-desktop-image-overlay transition-opacity duration-300 group-hover:opacity-[0.72]" />
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,26,31,0.985)_0%,rgba(4,26,31,0.95)_28%,rgba(4,26,31,0.84)_48%,rgba(4,26,31,0.60)_72%,rgba(4,26,31,0.46)_100%)] opacity-100 transition-opacity duration-300 group-hover:opacity-[0.55]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_52%)] opacity-100 transition-opacity duration-300 group-hover:opacity-[0.7] md:hidden" />
                    </div>
                  )}
                  <div className={`min-w-0 ${isDecoratedProject ? "relative z-10" : ""}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xl font-semibold text-white">{p.name}</div>
                        <p className="mt-1 text-base text-cyan-100/65">{p.desc}</p>
                      </div>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-[#020d10]/40 px-3 py-1.5 text-sm text-cyan-200/65 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-400/30 transition-all">
                        {p.linkText === "GitHub" ? <Github className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                        {p.linkText}
                      </a>
                    </div>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-white/75">
                      {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                    </div>
                  </div>
                </HoverCard>
              )})}
              {filteredProjects.length === 0 && (
                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4 text-base text-cyan-100/65">Ничего не найдено. Попробуй другой запрос.</div>
              )}
            </div>
          </Section>

        </div>

        {/* RIGHT */}
        <div className="md:col-span-5 flex flex-col gap-4">

          <Section icon={Radar} title="Сильные стороны" subtitle="Что отличает меня как специалиста">
            <ul className="list-disc space-y-2.5 pl-5 text-base text-white/75">
              {data.highlights.map((h, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.3 }}>
                  {h}
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section icon={Terminal} title="Навыки" subtitle="Технический стек и компетенции">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-semibold tracking-wide text-cyan-300/60">БЕЗОПАСНОСТЬ</div>
                <div className="flex flex-wrap gap-2">{data.skills.core.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </div>
              <Divider />
              <div>
                <div className="mb-2 text-sm font-semibold tracking-wide text-cyan-300/60">ОПЕРАЦИИ</div>
                <div className="flex flex-wrap gap-2">{data.skills.operations.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </div>
              <Divider />
              <div>
                <div className="mb-2 text-sm font-semibold tracking-wide text-cyan-300/60">ИНСТРУМЕНТЫ</div>
                <div className="flex flex-wrap gap-2">{data.skills.tools.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </div>
            </div>
          </Section>

          <Section icon={Cpu} title="Цель" subtitle="Куда я двигаюсь">
            <HoverCard className="rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4">
              <div className="text-base text-white/75">
                <div className="text-lg font-semibold text-white">Развитие в ИБ и IAM</div>
                <p className="mt-2 leading-relaxed">{data.mission}</p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <div className="rounded-xl border border-cyan-400/10 bg-[#020d10]/40 p-3">
                    <div className="text-sm font-semibold text-cyan-300/65">Моя суперсила</div>
                    <div className="mt-1 text-base text-white/80">Понимаю атаки изнутри — это даёт преимущество при проектировании защитных систем.</div>
                  </div>
                  <div className="rounded-xl border border-cyan-400/10 bg-[#020d10]/40 p-3">
                    <div className="text-sm font-semibold text-cyan-300/65">Сейчас прокачиваю</div>
                    <div className="mt-1 text-base text-white/80">Сетевая безопасность, IAM-практики, углубление Python для автоматизации ИБ-задач.</div>
                  </div>
                </div>
              </div>
            </HoverCard>
          </Section>

          <Section icon={GraduationCap} title="Образование" subtitle="Академическая база">
            <div className="space-y-4">
              {data.education.map((ed) => (
                <HoverCard key={ed.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-xl font-semibold text-white">{ed.title}</div>
                      <div className="mt-0.5 text-base text-cyan-200/60">{ed.meta}</div>
                    </div>
                    <div className="text-sm text-cyan-200/45">{ed.period}</div>
                  </div>
                  {ed.bullets.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-white/75">
                      {ed.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </HoverCard>
              ))}
            </div>
          </Section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 pb-10 text-sm text-cyan-200/40 print:hidden md:px-12">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#041a1f]/50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-base font-semibold text-white">Aleksandar Portfolio</div>
              <div className="mt-1 max-w-md text-sm leading-6 text-cyan-200/55">
                Frontend projects, technical reviews and contact
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm md:justify-end">
              <a href="https://t.me/frankoleet" target="_blank" rel="noopener noreferrer" className="text-cyan-300/70 transition-colors hover:text-cyan-300">Telegram</a>
              <a href="https://github.com/frankoleet" target="_blank" rel="noopener noreferrer" className="text-cyan-300/70 transition-colors hover:text-cyan-300">GitHub</a>
              <a href="mailto:frankoleet@gmail.com" className="text-cyan-300/70 transition-colors hover:text-cyan-300">Email</a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start gap-3 border-t border-cyan-400/10 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl text-cyan-200/40 leading-6">
              © {new Date().getFullYear()}{" "}
              <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="text-cyan-200/55 transition-colors hover:text-cyan-300"
              >
                The Aleksandar Space
              </Link>
              . Crafted & Designed by Aleksandar.
            </div>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-100 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/20 hover:text-cyan-50 sm:w-auto"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </footer>

    <style>{`
      .project-card-desktop-image-container {
        display: none;
      }

      @media (min-width: 768px) {
        .project-card-desktop-image-container {
          position: absolute;
          top: 4.6rem;
          right: 0.95rem;
          bottom: 0.95rem;
          width: min(31rem, 62%);
          display: block;
          overflow: hidden;
          border-radius: 1rem;
        }

        .project-card-desktop-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          opacity: 0.34;
        }

        .project-card-desktop-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(4, 26, 31, 0.18), rgba(4, 26, 31, 0.52)),
            radial-gradient(circle at 52% 46%, rgba(34, 211, 238, 0.1), transparent 56%);
          opacity: 0.92;
        }
      }

      @media print {
        /* 1. Включаем печать фоновых цветов и графики */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* 2. Скрываем всё лишнее */
        body * {
          visibility: hidden !important;
        }

        /* 3. Показываем только шапку и контакты */
        header, header *,
        .hidden.print\\:block, .hidden.print\\:block * {
          visibility: visible !important;
        }

        /* 4. Стилизуем шапку */
        header {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          display: block !important;
          padding: 0 !important;
        }

        /* Скрываем кнопки внутри шапки */
        header .print\\:hidden {
          display: none !important;
        }

        /* 5. Стилизуем блок контактов "как шапку" */
        .hidden.print\\:block {
          display: block !important;
          position: absolute !important;
          top: 300px !important; /* Отступ под шапкой */
          left: 0 !important;
          width: 100% !important;
          
          /* Повторяем дизайн шапки из твоего кода */
          background-color: #041a1f !important;
          border: 1px solid rgba(34, 211, 238, 0.15) !important;
          border-radius: 1.5rem !important; /* rounded-3xl */
          padding: 1.5rem !important;
        }

        /* Сетка для контактов внутри блока */
        .hidden.print\\:block > div {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 10px !important;
          border: none !important;
          background: transparent !important;
        }

        @page {
          size: A4;
          margin: 10mm;
        }
      }
    `}</style>

    </div>
  );
}
