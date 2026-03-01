import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Terminal, Clock, Eye, Tag, ArrowLeft,
  ChevronRight, BookOpen, Cpu, Lock, Search, X,
} from "lucide-react";

// ── Частицы (те же что на главной) ───────────────────────────────────────────
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

const Chip = ({ children, active, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
      active
        ? "border-cyan-400/60 bg-cyan-500/25 text-cyan-200"
        : "border-cyan-400/15 bg-cyan-500/10 text-cyan-100/70 hover:border-cyan-400/35 hover:bg-cyan-500/18"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.button>
);

// ── Навигация (общая для обеих страниц) ───────────────────────────────────────
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

// ── Данные статей ─────────────────────────────────────────────────────────────
const articles = [
  {
    id: "stealer-anatomy",
    title: "Анатомия Stealer: как работает кража данных",
    preview: "Разбираю внутреннее устройство типичного инфостилера — от первичного заражения до эксфильтрации данных. Смотрим на цепочку: дроппер → инжект → сбор credentials → отправка на C2.",
    content: `## Что такое Stealer

Infostealer — это класс вредоносного ПО, основная цель которого сбор и кража данных: паролей, cookies, данных банковских карт, crypto-кошельков.

## Типичная цепочка заражения

**1. Дистрибуция**
Чаще всего через фишинг, варез-сайты, поддельные установщики ПО. Жертва скачивает "читы для игры" или "кряк Adobe" — получает дроппер.

**2. Дроппер**
Небольшой исполняемый файл. Задача — избежать детекции AV и загрузить основную нагрузку. Использует: обфускацию, подпись легитимным сертификатом, задержку выполнения.

**3. Основная нагрузка (payload)**
Запускается в памяти (fileless) или записывается на диск. Начинает сбор данных.

## Что собирает типичный Stealer

- **Браузеры**: cookies, saved passwords, autofill, история (Chromium, Firefox, Edge)
- **Crypto**: seed-фразы, private keys из MetaMask, Exodus, Electrum
- **Мессенджеры**: сессии Telegram, Discord tokens
- **Системная инфа**: screenshot, IP, hardware ID, список процессов

## Методы обхода защиты

Современные стилеры используют:
- **Крипт**: шифрование payload'а, расшифровка только в памяти
- **VM/sandbox detection**: проверка количества процессов, CPUID, разрешения экрана
- **AMSI bypass**: патчинг amsi.dll в памяти процесса

## Вектор защиты

Понимание этой цепочки позволяет строить детекцию на каждом этапе: поведенческий анализ дроппера, мониторинг обращений к браузерным БД, контроль исходящих соединений на C2.`,
    tags: ["Stealer", "Malware", "Windows"],
    date: "15 янв 2026",
    readTime: 7,
    icon: Shield,
    accentColor: "rgba(239,68,68,0.15)",
    borderColor: "rgba(239,68,68,0.25)",
  },
  {
    id: "rat-persistence",
    title: "RAT и persistence: как малварь выживает после перезагрузки",
    preview: "Изучаю методы закрепления Remote Access Trojan в системе. Реестр, планировщик задач, DLL hijacking, COM hijacking — разбираю каждый метод и как его обнаружить.",
    content: `## Что такое persistence

Persistence — механизм, позволяющий вредоносному ПО оставаться в системе после перезагрузки. Без него RAT умирает при первом ребуте.

## Основные методы

**1. Registry Run Keys**
Классика. Запись в:
\`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`

Просто, но легко детектируется. Используется в дешёвых RAT.

**2. Scheduled Tasks**
Создание задачи через schtasks.exe или COM-объект ITaskService. Более гибко — можно настроить триггер на вход пользователя, определённое время, событие.

**3. DLL Hijacking**
Подмена легитимной DLL вредоносной в директории с более высоким приоритетом поиска. Когда легитимное приложение запускается — загружает малварь.

**4. COM Hijacking**
Регистрация вредоносного COM-объекта в HKCU вместо HKLM. При вызове легитимным приложением — выполняется код атакующего.

**5. WMI Event Subscription**
Продвинутый метод. Подписка на WMI-событие (например, запуск системы) с execution payload. Сложно детектируется стандартными средствами.

## Как обнаружить

- **Autoruns** (Sysinternals) — показывает все точки автозапуска
- **Sysmon** — логирование создания процессов, изменений реестра
- **ETW** (Event Tracing for Windows) — для WMI-подписок

## Вывод

Знание методов persistence — основа для построения мониторинга. Каждый метод оставляет артефакты, задача защитника — их поймать.`,
    tags: ["RAT", "Persistence", "Windows", "Detection"],
    date: "28 янв 2026",
    readTime: 6,
    icon: Terminal,
    accentColor: "rgba(168,85,247,0.15)",
    borderColor: "rgba(168,85,247,0.25)",
  },
  {
    id: "session-hijacking",
    title: "Session Hijacking: компрометация сессий браузера",
    preview: "Как работает кража cookies и session tokens. Разбираю Pass-the-Cookie атаку, защиту через HttpOnly/Secure флаги и почему 2FA не всегда спасает.",
    content: `## Что такое Session Hijacking

После того как пользователь авторизовался на сайте, сервер выдаёт session token (обычно в cookie). Если атакующий получает этот токен — он может войти без пароля.

## Как происходит кража

**Через Stealer**
Инфостилер читает SQLite-базы Chromium (\`Default/Cookies\`) и расшифровывает их через DPAPI (Data Protection API Windows).

**Через XSS**
Если сайт уязвим к XSS — JavaScript атакующего читает document.cookie и отправляет на C2.

## Pass-the-Cookie атака

1. Получаем дамп cookies жертвы
2. Импортируем в браузер атакующего (через EditThisCookie или CDP)
3. Открываем сайт — сервер принимает нас за жертву

**Почему это работает даже с 2FA**: 2FA проверяется при логине, но не при каждом запросе. Session token уже содержит подтверждение 2FA.

## Защитные механизмы

- **HttpOnly**: JavaScript не может читать cookie (защита от XSS, не от Stealer)
- **Secure**: cookie передаётся только по HTTPS
- **SameSite=Strict**: защита от CSRF
- **Session binding**: привязка сессии к IP/User-Agent (легко обойти)
- **Short TTL**: короткое время жизни сессии

## Вывод

Защита на уровне cookie-флагов не спасает от Stealer. Нужен поведенческий мониторинг: неожиданная смена IP при активной сессии, аномальная геолокация.`,
    tags: ["Session", "Cookies", "Browser", "Attack"],
    date: "10 фев 2026",
    readTime: 5,
    icon: Lock,
    accentColor: "rgba(6,182,212,0.15)",
    borderColor: "rgba(6,182,212,0.25)",
  },
  {
    id: "python-ioc-scanner",
    title: "Пишем IOC-сканер на Python за 50 строк",
    preview: "Практика: пишем скрипт который сканирует систему на известные Indicators of Compromise — хэши файлов, подозрительные ключи реестра, сетевые соединения.",
    content: `## Что такое IOC

IOC (Indicator of Compromise) — артефакт, указывающий на то, что система была скомпрометирована. Это могут быть: MD5/SHA256 хэши известных вредоносных файлов, IP-адреса C2-серверов, подозрительные ключи реестра.

## Структура сканера

\`\`\`python
import hashlib
import os
import winreg
import json

# База известных вредоносных хэшей (упрощённо)
MALICIOUS_HASHES = {
    "44d88612fea8a8f36de82e1278abb02f",  # EICAR test
    # добавляй реальные из MISP/VirusTotal
}

SUSPICIOUS_REG_KEYS = [
    r"Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    r"Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
]

def hash_file(path):
    try:
        with open(path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def scan_directory(directory):
    findings = []
    for root, _, files in os.walk(directory):
        for fname in files:
            fpath = os.path.join(root, fname)
            h = hash_file(fpath)
            if h and h in MALICIOUS_HASHES:
                findings.append({"type": "file", "path": fpath, "hash": h})
    return findings

def scan_registry():
    findings = []
    for key_path in SUSPICIOUS_REG_KEYS:
        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path)
            i = 0
            while True:
                name, value, _ = winreg.EnumValue(key, i)
                findings.append({"type": "registry", "key": key_path, 
                                  "name": name, "value": value})
                i += 1
        except:
            pass
    return findings

if __name__ == "__main__":
    results = scan_directory(os.environ["TEMP"]) + scan_registry()
    print(json.dumps(results, indent=2, ensure_ascii=False))
\`\`\`

## Что улучшить дальше

- Подключить MISP или AlienVault OTX для актуальной базы IOC
- Добавить сетевые соединения через \`psutil.net_connections()\`
- Логирование в SIEM (JSON формат)
- Расписание запуска через Task Scheduler

Это базовый скелет — реальный корпоративный сканер строится на этих же принципах, только с большей базой и интеграциями.`,
    tags: ["Python", "IOC", "Scanner", "Blue Team"],
    date: "18 фев 2026",
    readTime: 8,
    icon: Cpu,
    accentColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.25)",
  },
];

// ── Все теги ──────────────────────────────────────────────────────────────────
const allTags = [...new Set(articles.flatMap((a) => a.tags))];

// ── Счётчик прочтений через localStorage ─────────────────────────────────────
function getReads() {
  try { return JSON.parse(localStorage.getItem("article_reads") || "{}"); }
  catch { return {}; }
}
function incrementRead(id) {
  const reads = getReads();
  reads[id] = (reads[id] || 0) + 1;
  try { localStorage.setItem("article_reads", JSON.stringify(reads)); }
  catch {}
  return reads[id];
}

// ── Компонент полной статьи ───────────────────────────────────────────────────
function ArticleView({ article, onClose }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // простой markdown-рендер (только ## заголовки, **bold**, `code`, блоки кода)
  const renderContent = (text) => {
    const lines = text.split("\n");
    const elements = [];
    let codeBlock = [];
    let inCode = false;
    let key = 0;

    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inCode) {
          elements.push(
            <pre key={key++} className="my-4 overflow-x-auto rounded-xl border border-cyan-400/15 bg-[#020d10]/80 p-4 text-sm text-cyan-100/90 font-mono leading-relaxed">
              {codeBlock.join("\n")}
            </pre>
          );
          codeBlock = []; inCode = false;
        } else { inCode = true; }
        continue;
      }
      if (inCode) { codeBlock.push(line); continue; }

      if (line.startsWith("## ")) {
        elements.push(<h2 key={key++} className="mt-8 mb-3 text-xl font-semibold text-white">{line.slice(3)}</h2>);
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(<p key={key++} className="mt-3 font-semibold text-cyan-200">{line.slice(2, -2)}</p>);
      } else if (line.startsWith("- ")) {
        const parts = line.slice(2).split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        elements.push(
          <li key={key++} className="ml-4 mt-1 text-white/75 list-disc">
            {parts.map((p, i) =>
              p.startsWith("`") ? <code key={i} className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-xs text-cyan-300 font-mono">{p.slice(1,-1)}</code>
              : p.startsWith("**") ? <strong key={i} className="text-white">{p.slice(2,-2)}</strong>
              : p
            )}
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={key++} className="h-2" />);
      } else {
        const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={key++} className="mt-2 text-base leading-relaxed text-white/75">
            {parts.map((p, i) =>
              p.startsWith("`") ? <code key={i} className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-xs text-cyan-300 font-mono">{p.slice(1,-1)}</code>
              : p.startsWith("**") ? <strong key={i} className="text-white/90">{p.slice(2,-2)}</strong>
              : p
            )}
          </p>
        );
      }
    }
    return elements;
  };

  const Icon = article.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="relative z-10 mx-auto w-full max-w-3xl px-12 pb-20"
    >
      <button
        onClick={onClose}
        className="mt-8 mb-6 flex items-center gap-2 text-cyan-300/70 hover:text-cyan-300 transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Назад к статьям
      </button>

      <div
        className="rounded-3xl border p-8"
        style={{ borderColor: article.borderColor, background: `linear-gradient(135deg, ${article.accentColor}, rgba(4,26,31,0.8))` }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2.5">
            <Icon className="h-6 w-6 text-cyan-300" />
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-md border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200/80">{t}</span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white leading-tight">{article.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-cyan-200/50">
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{article.readTime} мин чтения</span>
          <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{getReads()[article.id] || 1} просмотров</span>
          <span>{article.date}</span>
        </div>

        <div className="mt-6 h-px w-full bg-cyan-400/10" />
        <div className="mt-6">{renderContent(article.content)}</div>
      </div>
    </motion.div>
  );
}

// ── Карточка статьи ───────────────────────────────────────────────────────────
function ArticleCard({ article, reads, onRead }) {
  const Icon = article.icon;
  return (
    <motion.div
      className="group relative rounded-2xl border bg-[#041a1f]/60 backdrop-blur overflow-hidden cursor-pointer"
      style={{ borderColor: "rgba(34,211,238,0.1)" }}
      whileHover={{ y: -4, boxShadow: `0 0 0 1.5px ${article.borderColor}, 0 12px 40px rgba(6,182,212,0.15)` }}
      transition={{ duration: 0.2 }}
      onClick={onRead}
    >
      {/* цветная полоска сверху */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${article.borderColor}, transparent)` }} />

      {/* фоновый акцент */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 20% 50%, ${article.accentColor}, transparent 70%)` }} />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2.5 flex-shrink-0">
              <Icon className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <span key={t} className="rounded-md border border-cyan-400/15 bg-cyan-500/8 px-2 py-0.5 text-xs text-cyan-200/70">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-cyan-200/45 flex-shrink-0">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{reads || 0}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime} мин</span>
          </div>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-white group-hover:text-cyan-100 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="mt-2 text-base text-white/60 leading-relaxed line-clamp-3">{article.preview}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-cyan-200/40">{article.date}</span>
          <span className="flex items-center gap-1.5 text-sm text-cyan-300/70 group-hover:text-cyan-300 transition-colors">
            Читать <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Главный компонент Reviews ─────────────────────────────────────────────────
export default function Reviews() {
  const [reads, setReads] = useState(getReads());
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const [openArticle, setOpenArticle] = useState(null);

  const handleRead = (article) => {
    const newCount = incrementRead(article.id);
    setReads((prev) => ({ ...prev, [article.id]: newCount }));
    setOpenArticle(article);
    window.scrollTo(0, 0);
  };

  const filtered = articles.filter((a) => {
    const matchTag = !activeTag || a.tags.includes(activeTag);
    const q = search.trim().toLowerCase();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.preview.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q));
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#020d10] text-white">
      <Particles />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]" style={{ backgroundImage: "radial-gradient(circle at 15% 10%, rgba(6,182,212,0.35) 0, rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 35%, rgba(20,184,166,0.25) 0, rgba(0,0,0,0) 55%)" }} />

      <NavBar current="Reviews" />

      <AnimatePresence mode="wait">
        {openArticle ? (
          <ArticleView key="article" article={openArticle} onClose={() => { setOpenArticle(null); window.scrollTo(0, 0); }} />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {/* Hero */}
            <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-6 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="relative rounded-3xl border border-cyan-400/15 overflow-hidden shadow-[0_0_0_1px_rgba(6,182,212,0.08),0_24px_70px_rgba(0,0,0,0.65)]"
              >
                {/* ── ФОН ШАПКИ: раскомментируй строку ниже и вставь путь к своему фото ── */}
                {/* <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/your-photo.jpg')" }} /> */}
                <div className="absolute inset-0 bg-[#041a1f]/80 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020d10]/60 via-transparent to-transparent" />

                <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/15 p-2.5">
                    <BookOpen className="h-6 w-6 text-cyan-300" />
                  </div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-1.5 text-sm font-medium text-cyan-100">
                    SECURITY REVIEWS
                  </span>
                </div>
                <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">Разборы</h1>
                <p className="mt-3 max-w-6xl text-xl text-cyan-200/60">Анализирую вредоносное ПО, методы атак и способы защиты. Каждая статья — практический разбор с примерами кода.</p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-500/5 px-4 py-2">
                    <Search className="h-4 w-4 text-cyan-300/60" />
                    <input
                      value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Поиск по статьям..."
                      className="bg-transparent text-sm text-white/80 outline-none placeholder:text-cyan-200/35 w-48"
                    />
                    {search && <button onClick={() => setSearch("")}><X className="h-3.5 w-3.5 text-cyan-300/50 hover:text-cyan-300" /></button>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={!activeTag} onClick={() => setActiveTag(null)}>
                      <Tag className="mr-1.5 h-3 w-3" />Все
                    </Chip>
                    {allTags.map((t) => (
                      <Chip key={t} active={activeTag === t} onClick={() => setActiveTag(activeTag === t ? null : t)}>{t}</Chip>
                    ))}
                  </div>
                </div>
                </div>
              </motion.div>
            </div>

            {/* Сетка карточек */}
            <main className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pb-16">
              <div className="mb-4 text-sm text-cyan-200/40">
                {filtered.length} {filtered.length === 1 ? "статья" : filtered.length < 5 ? "статьи" : "статей"}
              </div>
              <motion.div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtered.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                  >
                    <ArticleCard article={a} reads={reads[a.id] || 0} onRead={() => handleRead(a)} />
                  </motion.div>
                ))}
              </motion.div>
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-8 text-center text-base text-cyan-100/50">
                  Ничего не найдено. Попробуй другой запрос или тег.
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}