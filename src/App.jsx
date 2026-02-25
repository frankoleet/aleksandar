import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield, Terminal, Radar, Medal, Briefcase, GraduationCap,
  Cpu, Layers, Sparkles, Search, Download, Github, Lock,
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
const HoverCard = ({ children }) => (
  <motion.div
    className="rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4"
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

const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
};

const data = {
  name: "Aleksandar",
  role: "Специалист по информационной безопасности (Junior)",
  tagline: "Целенаправленно развиваюсь в сфере информационной безопасности и IAM — изучаю архитектуру угроз, методы защиты и автоматизацию. Двигаюсь системно: от понимания атак к построению защиты.",
  mission: "Цель — войти в область ИБ и IAM, где важны точность, дисциплина и глубокое понимание угроз.",

  highlights: [
    "Понимание архитектуры Stealer/RAT: методы компрометации сессий, сокрытия (крипт) и кражи данных",
    "Практический опыт с Windows и Linux: администрирование, настройка, понимание внутренних механизмов ОС",
    "Базовые принципы защиты: минимизация привилегий, аудит доступов, защита данных",
    "Умею проектировать системы мониторинга аномальной активности на основе знания реальных угроз",
    "Публикую учебные проекты на GitHub — придерживаюсь культуры воспроизводимости и документирования",
  ],

  skills: {
    core: [
      "Windows / Linux администрирование", "Анализ угроз: Stealer / RAT",
      "Компрометация сессий и защита", "Базовая безопасность и аудит доступов",
      "Минимизация привилегий (Least Privilege)",
    ],
    operations: [
      "Проектирование мониторинга аномалий", "Автоматизация на Python (базовый)",
      "Контроль версий: Git / GitHub", "Анализ методов сокрытия вредоносного ПО",
    ],
    tools: [
      "Python (скрипты, автоматизация)", "Git / GitHub", "Windows Server / Linux CLI",
      "Wireshark (базовый)", "HTML + CSS", "React (начальный)", "JavaScript", "PowerShell",
    ],
  },

  experience: [
    {
      title: "GitHub: публикация и ведение проектов", company: "github.com/frankoleet", period: "2023 — сейчас",
      bullets: [
        "Публикация учебных и исследовательских проектов с описанием и воспроизводимостью",
        "Контроль версий, структурирование репозиториев, написание документации",
        "Автоматизация рутинных задач с помощью Python-скриптов",
      ],
      tags: ["GitHub", "Python", "Документирование"],
    },
    {
      title: "Самообучение: архитектура вредоносного ПО", company: "Самостоятельное исследование", period: "2022 — 2023",
      bullets: [
        "Изучение архитектуры Stealers и RAT в рамках самообучения и исследовательских задач",
        "Изучение материалов и кейсов на профессиональных технических сообществах по ИБ",
        "Анализ методов сокрытия вредоносного кода (крипт, обфускация)",
      ],
      tags: ["Malware Analysis", "OSINT", "Self-study"],
    },
    {
      title: "Учебные проекты: программирование и ИБ", company: "Nomad College", period: "2021 — 2022",
      bullets: [
        "Выполнение учебных проектов по программированию и информационной безопасности",
        "Первые шаги в написании скриптов на Python для автоматизации задач",
        "Знакомство с основами сетевой безопасности и архитектурой ОС",
      ],
      tags: ["Python", "ИБ-основы", "Колледж"],
    },
  ],

  projects: [
    {
      name: "Скрипты автоматизации учётных записей",
      desc: "Python-скрипты для упрощения операций с учётными записями и данными. Цель — снизить ручной труд при типовых IAM-задачах.",
      bullets: ["Автоматизация создания, изменения и деактивации учётных записей", "Логирование действий и базовый аудит операций"],
      tags: ["Python", "IAM", "Автоматизация"], linkText: "GitHub", link: "https://github.com/frankoleet",
    },
    {
      name: "Исследование: механики Stealer/RAT",
      desc: "Самостоятельное изучение архитектуры вредоносного ПО для понимания методов атак и построения эффективной защиты.",
      bullets: ["Анализ методов компрометации сессий, кражи данных и обхода защит", "Спроектирована концепция системы мониторинга аномальной активности"],
      tags: ["Threat Analysis", "Defence", "Research"], linkText: "GitHub", link: "https://github.com/frankoleet",
    },
    {
      name: "Linux & Windows: практическая настройка",
      desc: "Практические эксперименты с настройкой ОС, управлением привилегиями и базовым харденингом систем.",
      bullets: ["Настройка политик минимальных привилегий и аудита доступов", "Мониторинг трафика (Wireshark), сетевые настройки"],
      tags: ["Linux", "Windows", "Hardening"], linkText: "GitHub", link: "https://github.com/frankoleet",
    },
  ],

  education: [
    { title: "Баткенский государственный университет", meta: "3 курс • в процессе обучения", period: "2024 — сейчас", bullets: [] },
    {
      title: "Nomad College", meta: "Техник-программист", period: "2021 — 2024",
      bullets: ["Специальность: Техник-программист", "Учебные проекты по программированию и информационным системам"],
    },
  ],

  links: [
    { label: "Telegram", value: "t.me/frankoleet", href: "https://t.me/frankoleet" },
    { label: "Email", value: "frankoleet@gmail.com", href: "mailto:frankoleet@gmail.com" },
    { label: "GutHub", value: "github.com/frankoleet", href: "https://github.com/frankoleet" },
  ],
};

export default function App() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.projects;
    return data.projects.filter((p) =>
      [p.name, p.desc, ...(p.bullets || []), ...(p.tags || [])].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const handleCopy = async () => {
    const text =
      `${data.name} — ${data.role}\n\n${data.tagline}\n\n` +
      `Опыт:\n${data.experience.map((e) => `- ${e.title} (${e.company}) — ${e.period}`).join("\n")}\n\n` +
      `Навыки:\n- ${data.skills.core.join("\n- ")}\n\n` +
      `Контакты:\n${data.links.map((l) => `${l.label}: ${l.value}`).join("\n")}`;
    const ok = await copyToClipboard(text);
    setToast(ok ? "Скопировано в буфер обмена." : "Не получилось скопировать :(");
    setTimeout(() => setToast(null), 2200);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#020d10] text-white">

      <Particles />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]" style={{ backgroundImage: "radial-gradient(circle at 15% 10%, rgba(6,182,212,0.35) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 35%, rgba(20,184,166,0.25) 0, rgba(0,0,0,0) 55%), radial-gradient(circle at 50% 95%, rgba(34,211,238,0.18) 0, rgba(0,0,0,0) 45%)" }} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.04),transparent_30%,transparent_70%,rgba(20,184,166,0.03))]" />

      {/* HEADER */}
      <header className="relative z-10 mx-auto w-full max-w-screen-2xl px-12 pb-6 pt-10 print:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="rounded-3xl border border-cyan-400/15 bg-[#041a1f]/60 p-6 shadow-[0_0_0_1px_rgba(6,182,212,0.08),0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge><Shield className="mr-2 h-3.5 w-3.5" />INFOSEC PROFILE</Badge>
                <Badge><Lock className="mr-2 h-3.5 w-3.5" />SECURITY MINDED</Badge>
              </div>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">{data.name}</h1>
              <p className="mt-2 text-xl text-cyan-200/70 md:text-2xl">{data.role}</p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">{data.tagline}</p>
            </div>

            <div className="flex flex-col gap-2 md:items-end print:hidden">
              <div className="flex w-full gap-2 md:w-auto">
                <button onClick={handleCopy} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-500/5 px-5 py-2.5 text-base font-medium text-white/90 hover:bg-cyan-500/15 md:flex-none transition-colors">
                  <Download className="h-4 w-4" />Copy
                </button>
                <button onClick={handlePrint} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-5 py-2.5 text-base font-medium text-cyan-100 hover:bg-cyan-500/25 md:flex-none transition-colors">
                  <Medal className="h-4 w-4" />Print
                </button>
              </div>
              <div className="rounded-2xl border border-cyan-400/10 bg-[#020d10]/50 p-3 text-sm text-cyan-200/55">
                <div className="mb-2 font-medium text-cyan-100/70">Контакты</div>
                <div className="flex flex-col gap-1">
                  {data.links.map((l) => (
                    <div key={l.label} className="flex items-center justify-between gap-4">
                      <span className="text-cyan-200/45">{l.label}</span>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="truncate text-cyan-100/75 hover:text-cyan-300 transition-colors">{l.value}</a>
                    </div>
                  ))}
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
      <main className="relative z-10 mx-auto w-full max-w-screen-2xl grid grid-cols-1 gap-4 px-12 pb-16 md:grid-cols-12 print:pb-4">

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
              {filteredProjects.map((p) => (
                <HoverCard key={p.name}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xl font-semibold text-white">{p.name}</div>
                      <p className="mt-1 text-base text-cyan-100/65">{p.desc}</p>
                    </div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-[#020d10]/40 px-3 py-1.5 text-sm text-cyan-200/65 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-400/30 transition-all">
                      <Github className="h-3.5 w-3.5" />{p.linkText}
                    </a>
                  </div>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-white/75">
                    {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </HoverCard>
              ))}
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
      <footer className="relative z-10 mx-auto w-full max-w-screen-2xl px-12 pb-10 text-sm text-cyan-200/40 print:hidden">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#041a1f]/50 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Aleksandar •{" "}
                <a href="https://t.me/frankoleet" target="_blank" rel="noopener noreferrer" className="text-cyan-300/70 hover:text-cyan-300 transition-colors">Contact</a>
              </span>
            </div>
            <div className="text-cyan-200/40">© {new Date().getFullYear()} • Aleksandar</div>
          </div>
        </div>
      </footer>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-400/15 bg-[#020d10]/90 px-4 py-2 text-base text-cyan-100/80 shadow-xl backdrop-blur">
          {toast}
        </motion.div>
      )}

    <style>{`
        @media print {
            html, body { 
            height: 100vh; 
            overflow: hidden !important; 
            background: white !important; 
            }
            
            .print\\:hidden { display: none !important; }
            
            * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            break-inside: avoid; 
            }

            /* Убираем лишние отступы, которые могут выталкивать контент */
            @page {
            margin: 0;
            }
        }
    `}</style>

    </div>
  );
}