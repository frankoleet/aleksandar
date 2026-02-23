import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Target,
  Radar,
  Medal,
  MapPin,
  Briefcase,
  GraduationCap,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Download,
  Link as LinkIcon,
} from "lucide-react";

// Single-file resume website.
// Styling: Tailwind (no imports needed).

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
    {children}
  </span>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
    {children}
  </span>
);

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <section className="rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur">
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
        <Icon className="h-5 w-5 text-emerald-200" />
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-white/60">{subtitle}</p> : null}
      </div>
    </div>
    {children}
  </section>
);

const Divider = () => <div className="my-4 h-px w-full bg-white/10" />;

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const data = {
  // Публичное резюме: без телефона/ИНН/даты рождения.
  name: "Нура (Брат)",
  role: "B2B Sales Manager • Tech & Retail контекст",
  location: "Бишкек, Кыргызстан",
  tagline:
    "Делаю продажи как операцию: разведка → план → контакт → сделка → удержание. Люблю цифры, порядок и скорость.",
  mission:
    "Ищу роль в B2B продажах/аккаунтинге — там, где важны дисциплина, переговоры и системный подход.",

  highlights: [
    "Опыт B2B продаж (оригинальная одежда брендов: Nike, Mejoor, Rudis, Jako)",
    "Умею собирать прайсы и структуру по технике/комплектующим (CPU/корпуса/периферия)",
    "~3 года на оптовом рынке женской одежды (без корпоративного стажа, но с реальными сделками)",
    "Параллельно: 3D/рендер (дизайн банки энергетика) + интерес к продукту/ИТ (Flutter-проект)",
  ],

  skills: {
    core: [
      "Переговоры и закрытие сделок",
      "Холодные/тёплые контакты, фоллоу-ап",
      "Коммерческие предложения, прайсинг",
      "Работа с возражениями",
      "Понимание тендерной логики",
    ],
    operations: [
      "Воронка и дисциплина (CRM-мышление)",
      "Сравнение и сборка конфигов ПК",
      "Координация партнёров/подрядчиков (траффик)",
      "Сбор требований от клиента (ТЗ)",
    ],
    tools: [
      "Blender 4.3.2 (RU UI)",
      "Inkscape (EN UI)",
      "Flutter / Cursor AI (в процессе)",
      "Excel/Sheets (прайсы, таблицы)",
    ],
  },

  experience: [
    {
      title: "B2B менеджер по продажам",
      company: "Оригинальная одежда (опт) — Nike / Mejoor / Rudis / Jako",
      period: "2025 — сейчас",
      bullets: [
        "Ведение B2B клиентов: переговоры → предложение → условия → закрытие",
        "Стратегия масштабирования: подключение траффик-партнёров под 5% (KZ/KG/TJ/UZ)",
        "Систематизация ассортимента и условий под разные сегменты партнёров",
      ],
      tags: ["B2B", "Опт", "Переговоры", "Партнёрка"],
    },
    {
      title: "Оптовый рынок: продажи женской одежды",
      company: "Самозанятость / торговая практика",
      period: "~3 года (до 2025)",
      bullets: [
        "Продажи на потоке: запрос → ассортимент → цена → доверие",
        "Дисциплина по закупке/прайсингу/марже на реальных деньгах",
        "Быстрая коммуникация и адаптация под клиента",
      ],
      tags: ["Рынок", "Маржа", "Коммуникация"],
    },
  ],

  projects: [
    {
      name: "GBro — соцсеть для поиска напарника в зал",
      desc:
        "Идея приложения на Flutter: регистрация, поиск партнёра по залу/времени/дате/полу, чат, лента формата Reels.",
      bullets: [
        "Фокус на MVP: регистрация + поиск напарника",
        "Хочу делать через Cursor AI и докручивать знания по ходу",
      ],
      tags: ["Flutter", "MVP", "Product"],
      linkText: "Черновик концепта",
      link: "#",
    },
    {
      name: "Дизайн банки энергетика (3D/рендер)",
      desc:
        "Работаю над визуалом: материалы, металлические элементы, узоры, PBR-логика (без normal map — отдельная регулировка).",
      bullets: [
        "Эксперименты с материалами и читаемостью дизайна",
        "Итерации по фидбеку",
      ],
      tags: ["Blender", "Design", "Rendering"],
      linkText: "Портфолио (добавлю)",
      link: "#",
    },
    {
      name: "Прайс-база по ПК комплектующим",
      desc:
        "Веду таблицу с CPU (AMD/Intel), корпусами и периферией: модели, характеристики, цены, сверка позиций.",
      bullets: [
        "Сбор конфигов под бюджет/задачи (игры, работа, кибербезопасность)",
        "Проверка совместимости: сокеты, DDR4/DDR5, питание, форм-фактор",
      ],
      tags: ["PC", "Excel", "Pre-sales"],
      linkText: "Демо (по запросу)",
      link: "#",
    },
  ],

  education: [
    {
      title: "Международный университет Кыргызстана (МУК)",
      meta: "Информационные системы и технологии • заочно • 3 курс",
      period: "2023 — 2029 (в процессе)",
      bullets: [
        "Параллельно прокачиваю прикладные навыки: продукт/продажи/аналитика",
      ],
    },
  ],

  links: [
    { label: "Telegram", value: "@your_handle", hint: "замени на свой" },
    { label: "Email", value: "you@example.com", hint: "замени на свой" },
    { label: "Portfolio", value: "your-site.com", hint: "замени на свой" },
  ],
};

export default function MilitaryResumeSite() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.projects;
    return data.projects.filter((p) =>
      [p.name, p.desc, ...(p.bullets || []), ...(p.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const handleCopy = async () => {
    const text = `${data.name} — ${data.role}\n${data.location}\n\n${data.tagline}\n\nОпыт:\n${data.experience
      .map((e) => `- ${e.title} (${e.company}) — ${e.period}`)
      .join("\n")}\n\nНавыки:\n- ${data.skills.core.join("\n- ")}`;

    const ok = await copyToClipboard(text);
    setToast(ok ? "Скопировано. Можно вставлять куда угодно." : "Не получилось скопировать :(");
    setTimeout(() => setToast(null), 2200);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#060a07] text-white">
      {/* subtle tactical glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.25) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 40%, rgba(34,197,94,0.18) 0, rgba(0,0,0,0) 55%), radial-gradient(circle at 50% 90%, rgba(110,231,183,0.12) 0, rgba(0,0,0,0) 45%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_30%,transparent_70%,rgba(255,255,255,0.03))]" />

      <header className="relative mx-auto max-w-6xl px-4 pb-6 pt-10 print:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  MIL-SPEC RESUME
                </Badge>
                <Badge>
                  <Radar className="mr-2 h-3.5 w-3.5" />
                  READY FOR DEPLOYMENT
                </Badge>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {data.name}
              </h1>
              <p className="mt-2 text-base text-white/70 md:text-lg">{data.role}</p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {data.location}
                </span>
                <span className="hidden h-4 w-px bg-white/10 md:block" />
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4" /> {data.mission}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
                {data.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-2 md:items-end print:hidden">
              <div className="flex w-full gap-2 md:w-auto">
                <button
                  onClick={handleCopy}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 md:flex-none"
                >
                  <Download className="h-4 w-4" />
                  Copy
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/15 md:flex-none"
                >
                  <Medal className="h-4 w-4" />
                  Print
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                <div className="mb-2 font-medium text-white/75">Контакты (замени на свои)</div>
                <div className="flex flex-col gap-1">
                  {data.links.map((l) => (
                    <div key={l.label} className="flex items-center justify-between gap-3">
                      <span className="text-white/55">{l.label}</span>
                      <span className="truncate text-white/80">{l.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="relative mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-16 md:grid-cols-12 print:pb-0">
        {/* left */}
        <div className="md:col-span-7">
          <Section icon={Briefcase} title="Опыт" subtitle="Как я двигаю сделки и удерживаю партнёров">
            <div className="space-y-4">
              {data.experience.map((e) => (
                <div key={e.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-white">{e.title}</div>
                      <div className="mt-0.5 text-sm text-white/65">{e.company}</div>
                    </div>
                    <div className="text-xs text-white/55">{e.period}</div>
                  </div>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/75">
                    {e.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="mt-4">
            <Section icon={Sparkles} title="Проекты" subtitle="Параллельные миссии: продукт, дизайн, тех-база">
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по проектам (например: Flutter, Blender, прайс)"
                  className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/40"
                />
              </div>

              <div className="space-y-4">
                {filteredProjects.map((p) => (
                  <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-white">{p.name}</div>
                        <p className="mt-1 text-sm text-white/70">{p.desc}</p>
                      </div>
                      <a
                        href={p.link}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/70 hover:bg-black/40"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        {p.linkText}
                      </a>
                    </div>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/75">
                      {p.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredProjects.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Ничего не найдено. Попробуй другой запрос.
                  </div>
                ) : null}
              </div>
            </Section>
          </div>
        </div>

        {/* right */}
        <div className="md:col-span-5">
          <Section icon={Target} title="Сильные стороны" subtitle="Коротко и по делу">
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/75">
              {data.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </Section>

          <div className="mt-4">
            <Section icon={Radar} title="Навыки" subtitle="Сетка навыков: core / ops / tools">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-wide text-white/60">CORE</div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.core.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
                <Divider />
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-wide text-white/60">OPERATIONS</div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.operations.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
                <Divider />
                <div>
                  <div className="mb-2 text-xs font-semibold tracking-wide text-white/60">TOOLS</div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.tools.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-4">
            <Section icon={Cpu} title="Фокус" subtitle="Вектор на ближайшее будущее">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/75">
                  <div className="font-semibold text-white">Куда я целюсь</div>
                  <p className="mt-2 leading-relaxed">
                    B2B продажи/аккаунтинг в товарке или IT (железо, софт, сервисы). Хочу роли,
                    где есть KPI, воронка, переговоры и понятный рост.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="text-xs font-semibold text-white/70">Суперсила</div>
                      <div className="mt-1 text-sm text-white/80">Быстро схватываю запрос клиента и превращаю хаос в план.</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                      <div className="text-xs font-semibold text-white/70">Что усиливаю</div>
                      <div className="mt-1 text-sm text-white/80">CRM дисциплина, КП, продуктовая логика.</div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-4">
            <Section icon={GraduationCap} title="Образование" subtitle="База + прокачка в процессе">
              <div className="space-y-4">
                {data.education.map((ed) => (
                  <div key={ed.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="text-base font-semibold text-white">{ed.title}</div>
                        <div className="mt-0.5 text-sm text-white/65">{ed.meta}</div>
                      </div>
                      <div className="text-xs text-white/55">{ed.period}</div>
                    </div>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-white/75">
                      {ed.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </main>

      <footer className="relative mx-auto max-w-6xl px-4 pb-10 text-xs text-white/45 print:hidden">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>
                Быстро редактируется: контакты/имя/опыт меняются в объекте <span className="text-white/70">data</span> наверху.
              </span>
            </div>
            <div className="text-white/45">© {new Date().getFullYear()} • Dark Ops Theme</div>
          </div>
        </div>
      </footer>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/80 px-4 py-2 text-sm text-white/80 shadow-xl backdrop-blur">
          {toast}
        </div>
      ) : null}

      <style>{`
        @media print {
          html, body { background: white !important; }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
