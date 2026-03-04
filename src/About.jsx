import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Code, BookOpen, Github, Target,
  Cpu, Terminal, User, Layers,
  TimerReset,
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
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
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
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(34,211,238,${0.07 * (1 - d / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}

// ── NavBar (идентичен App.jsx и Reviews.jsx) ──────────────────────────────────
const NavBar = () => {
  const location = useLocation();
  const active = location.pathname === "/" ? "Profile"
    : location.pathname === "/reviews" ? "Reviews"
    : location.pathname === "/about" ? "About"
    : "Profile";
  return (
    <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pt-6">
      <div className="flex justify-center">
        <nav className="flex items-center gap-1 rounded-2xl border border-cyan-400/15 bg-[#041a1f]/70 px-2 py-1.5 backdrop-blur shadow-[0_0_0_1px_rgba(34,211,238,0.05)]">
          {[
            { label: "Profile", to: "/" },
            { label: "Reviews", to: "/reviews" },
            { label: "About",   to: "/about" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                active === item.label
                  ? "bg-cyan-500/20 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                  : "text-cyan-200/55 hover:text-cyan-200/90 hover:bg-cyan-500/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// ── Timeline item ─────────────────────────────────────────────────────────────
const TimelineItem = ({ year, title, desc, icon: Icon, delay = 0 }) => (
  <motion.div
    className="relative flex gap-4 md:gap-6"
    initial={{ opacity: 0, x: -16 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
  >
    {/* линия + точка */}
    <div className="flex flex-col items-center">
      <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2 flex-shrink-0 z-10">
        <Icon className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="w-px flex-1 bg-cyan-400/10 mt-2" />
    </div>
    {/* контент */}
    <div className="pb-8 min-w-0">
      <div className="text-xs text-cyan-300/60 font-medium mb-1">{year}</div>
      <div className="text-lg font-semibold text-white">{title}</div>
      <p className="mt-1.5 text-base text-white/65 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

// ── Карточка навыка / факта ───────────────────────────────────────────────────
const Card = ({ children, delay = 0 }) => (
  <motion.div
    className="rounded-2xl border border-cyan-400/10 bg-[#041a1f]/60 p-5 backdrop-blur shadow-[0_0_0_1px_rgba(34,211,238,0.04),0_8px_32px_rgba(0,0,0,0.5)]"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -3, boxShadow: "0 0 0 1.5px rgba(34,211,238,0.25), 0 12px 40px rgba(6,182,212,0.12)" }}
  >
    {children}
  </motion.div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-[#020d10] text-white">
      <Particles />

      {/* фоновый глоу */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, rgba(6, 212, 143, 0.35) 0, rgba(187, 28, 28, 0) 45%), radial-gradient(circle at 80% 40%, rgba(20, 184, 94, 0.2) 0, rgba(255, 0, 0, 0) 50%)" }} />

      <NavBar active="About" />

      {/* HERO */}
      <header className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-cyan-400/15 overflow-hidden shadow-[0_0_0_1px_rgba(6,182,212,0.08),0_24px_70px_rgba(0,0,0,0.65)]"
        >
          {/* ── ФОН ШАПКИ: раскомментируй строку ниже и вставь путь к своему фото ── */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('ooo.png')" }}/>
          <div className="absolute inset-0 bg-[#041a1f]/80 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d10]/60 via-transparent to-transparent" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-1.5 text-sm font-medium text-cyan-100">
                <Shield className="mr-2 h-3.5 w-3.5" />ABOUT ME
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Обо мне</h1>
            <p className="mt-2 text-lg md:text-xl text-cyan-200/65">Специалист по информационной безопасности (Junior)</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
              Начинающий специалист в области информационной безопасности с устойчивым интересом
              к анализу угроз и защите систем. Имею опыт работы с учётными записями и правами доступа.
            </p>
          </div>
        </motion.div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-20 grid grid-cols-1 gap-4 md:grid-cols-12">

        {/* LEFT — история */}
        <div className="md:col-span-7 flex flex-col gap-4">

          {/* О себе */}
          <Card>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
                <User className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">О себе</h2>
                <p className="mt-0.5 text-lg text-cyan-200/50">Кто я и чем занимаюсь</p>
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-white/70">
              <p>
                Я начинающий специалист в области информационной безопасности с устойчивым интересом
                к анализу угроз и защите систем. Обладаю знаниями в изучении принципов работы
                вредоносного ПО — RAT и Stealer — в защитных целях.
              </p>
              <p>
                Хорошо понимаю методы кражи данных, способы сокрытия активности и базовые подходы
                к выявлению и предотвращению подобных угроз. Также понимаю методы социальной инженерии
                и риски, которые они несут для безопасности учётных записей и данных.
              </p>
              <p>
                Свои проекты и наработки публикую на{" "}
                <a
                  href="https://github.com/frankoleet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  github.com/frankoleet
                </a>
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
                <BookOpen className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Путь</h2>
                <p className="mt-0.5 text-lg text-cyan-200/50">Как всё начиналось</p>
              </div>
            </div>

            <div>
              <TimelineItem
                year="9 класс"
                title="Первые шаги в IT"
                desc="Начал изучать IT с начала 9 класса. Первый язык программирования — Python. Вместе с другом со школы мы отпрашивались после второго урока и в учительской разбирали задачи, схожие по логике с олимпиадными. Это заложило основу технического мышления."
                icon={Code}
                delay={0.05}
              />
              <TimelineItem
                year="2021 — 2024"
                title="Nomad College"
                desc="Продолжал развиваться в Nomad College до середины 2024 года. Изучал операционные системы Windows, безопасность устройств, использовал Python для автоматизации учебных задач. Именно здесь сформировалось техническое мышление и понимание принципов защиты систем."
                icon={Cpu}
                delay={0.1}
              />
              <TimelineItem
                year="2023 — сейчас"
                title="GitHub & самообразование"
                desc="Публикую учебные и исследовательские проекты на GitHub. Самостоятельно изучаю архитектуру вредоносного ПО, методы компрометации сессий и защитные техники."
                icon={Github}
                delay={0.15}
              />
              <TimelineItem
                year="2024 — сейчас"
                title="Баткенский государственный университет"
                desc="Продолжаю академическое образование. 3 курс, в процессе обучения."
                icon={BookOpen}
                delay={0.2}
              />
            </div>
          </Card>

        </div>

        {/* RIGHT — факты, навыки, цели */}
        <div className="md:col-span-5 flex flex-col gap-4">

          {/* Ключевые компетенции */}
          <Card delay={0.05}>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
                <Shield className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Компетенции</h2>
                <p className="mt-0.5 text-lg text-cyan-200/50">Что умею и понимаю</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Анализ вредоносного ПО", desc: "RAT, Stealer — архитектура и методы работы" },
                { label: "Компрометация сессий", desc: "Методы кражи данных и защита от них" },
                { label: "Социальная инженерия", desc: "Риски и методы противодействия" },
                { label: "Windows / Linux", desc: "Администрирование, харденинг, мониторинг" },
                { label: "Python автоматизация", desc: "Скрипты для IAM и ИБ задач" },
                { label: "IAM практики", desc: "Управление учётными записями и доступами" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="rounded-xl border border-cyan-400/10 bg-cyan-500/5 px-4 py-3"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  whileHover={{ borderColor: "rgba(34,211,238,0.25)", backgroundColor: "rgba(6,182,212,0.1)" }}
                >
                  <div className="text-sm font-semibold text-cyan-200">{item.label}</div>
                  <div className="text-sm text-white/55 mt-0.5">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Цели */}
          <Card delay={0.1}>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
                <Target className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Цели</h2>
                <p className="mt-0.5 text-lg text-cyan-200/50">Куда двигаюсь</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-cyan-400/10 bg-[#020d10]/40 p-3">
                <div className="text-sm font-semibold text-cyan-300/70">Краткосрочная</div>
                <div className="mt-1 text-base text-white/75">Войти в область ИБ и IAM в IT-компании.</div>
              </div>
              <div className="rounded-xl border border-cyan-400/10 bg-[#020d10]/40 p-3">
                <div className="text-sm font-semibold text-cyan-300/70">Сейчас изучаю</div>
                <div className="mt-1 text-base text-white/75">Сетевая безопасность, углубление Python, IAM-практики на уровне enterprise.</div>
              </div>
              <div className="rounded-xl border border-cyan-400/10 bg-[#020d10]/40 p-3">
                <div className="text-sm font-semibold text-cyan-300/70">Долгосрочная</div>
                <div className="mt-1 text-base text-white/75">Стать специалистом по threat intelligence и построению систем мониторинга угроз.</div>
              </div>
            </div>
          </Card>

          {/* Контакты */}
          <Card delay={0.15}>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2">
                <Layers className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Контакты</h2>
                <p className="mt-0.5 text-lg text-cyan-200/50">Связаться со мной</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Telegram", value: "@frankoleet", href: "https://t.me/frankoleet" },
                { label: "Email", value: "frankoleet@gmail.com", href: "mailto:frankoleet@gmail.com" },
                { label: "GitHub", value: "github.com/frankoleet", href: "https://github.com/frankoleet" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-cyan-500/5 px-4 py-3 hover:border-cyan-400/30 hover:bg-cyan-500/12 transition-all group"
                >
                  <span className="text-sm text-cyan-200/50">{c.label}</span>
                  <span className="text-sm text-cyan-100/80 group-hover:text-cyan-300 transition-colors">{c.value}</span>
                </a>
              ))}
            </div>
          </Card>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-10 text-sm text-cyan-200/40">
        <div className="rounded-2xl border border-cyan-400/10 bg-[#041a1f]/50 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>The Aleksandar Space •{" "}
                <a href="https://t.me/frankoleet" target="_blank" rel="noopener noreferrer" className="text-cyan-300/70 hover:text-cyan-300 transition-colors">Contact</a>
              </span>
            </div>
            <div className="text-cyan-200/40">© {new Date().getFullYear()} • About</div>
          </div>
        </div>
      </footer>
    </div>
  );
}