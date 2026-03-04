import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, User, MessageSquare, AtSign, Loader } from "lucide-react";

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

// ── NavBar ─────────────────────────────────────────────────────────────────────
const NavBar = () => {
  const location = useLocation();
  // На /contact ни одна кнопка не выделена
  const active = location.pathname === "/" ? "Profile"
    : location.pathname === "/reviews" ? "Reviews"
    : location.pathname === "/about" ? "About"
    : null;
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

// ── Поле ввода ─────────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-2 text-sm font-medium text-cyan-200/70">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-xs text-red-400/80"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputClass = (hasError) =>
  `w-full rounded-xl border ${hasError ? "border-red-400/40 bg-red-500/5" : "border-cyan-400/15 bg-cyan-500/5"} px-4 py-3 text-base text-white placeholder:text-white/25 outline-none transition-all focus:border-cyan-400/40 focus:bg-cyan-500/8 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.06)]`;

// ── Главный компонент ──────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: "", contacts: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Введи своё имя";
    if (!form.contacts.trim()) e.contacts = "Укажи контакт для связи";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm({ name: "", contacts: "", message: "" });
    setStatus("idle");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#020d10] text-white">
      <Particles />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
        style={{ backgroundImage: "radial-gradient(circle at 25% 15%, rgba(250,204,21,0.2) 0, transparent 45%), radial-gradient(circle at 75% 60%, rgba(6,182,212,0.25) 0, transparent 50%)" }} />

      <NavBar />

      <main className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 md:px-12 pt-8 pb-20">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">

            {/* ── Успех ── */}
            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-cyan-400/20 bg-[#041a1f]/60 p-8 md:p-12 text-center backdrop-blur"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 shadow-[0_0_32px_rgba(6,182,212,0.2)]"
                >
                  <CheckCircle className="h-10 w-10 text-cyan-300" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white">Заявка отправлена!</h2>
                <p className="mt-3 text-base text-white/60 max-w-sm mx-auto">
                  Получил твоё сообщение — свяжусь с тобой в ближайшее время через указанный контакт.
                </p>
                <button
                  onClick={reset}
                  className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-2.5 text-sm text-cyan-200 hover:bg-cyan-500/20 transition-colors"
                >
                  Отправить ещё
                </button>
              </motion.div>
            )}

            {/* ── Ошибка ── */}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-red-400/20 bg-[#041a1f]/60 p-8 text-center backdrop-blur"
              >
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400/70" />
                <h2 className="text-xl font-semibold text-white">Что-то пошло не так</h2>
                <p className="mt-2 text-sm text-white/55">Попробуй ещё раз или напиши напрямую в Telegram</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setStatus("idle")}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-2.5 text-sm text-cyan-200 hover:bg-cyan-500/20 transition-colors"
                  >
                    Попробовать снова
                  </button>
                  <a
                    href="https://t.me/frankoleet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-5 py-2.5 text-sm text-cyan-100 hover:bg-cyan-500/25 transition-colors"
                  >
                    Написать в Telegram
                  </a>
                </div>
              </motion.div>
            )}

            {/* ── Форма ── */}
            {(status === "idle" || status === "loading") && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-cyan-400/10 bg-[#041a1f]/60 p-6 md:p-8 backdrop-blur shadow-[0_0_0_1px_rgba(34,211,238,0.04),0_8px_32px_rgba(0,0,0,0.5)]"
              >
                {/* Заголовок формы */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-200">
                      <Send className="mr-1.5 h-3 w-3" />CONTACT
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white">Оставить заявку можно здесь</h1>
                  <p className="mt-1.5 text-sm text-white/50">Заполни форму — свяжусь в ближайшее время</p>
                </div>
                <div className="flex flex-col gap-5">

                  {/* Имя */}
                  <Field label="Имя" icon={User} error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      onFocus={() => setErrors((p) => ({ ...p, name: undefined }))}
                      placeholder="Как тебя зовут?"
                      className={inputClass(errors.name)}
                      disabled={status === "loading"}
                    />
                  </Field>

                  {/* Контакты */}
                  <Field label="Контакт для связи" icon={AtSign} error={errors.contacts}>
                    <input
                      type="text"
                      value={form.contacts}
                      onChange={set("contacts")}
                      onFocus={() => setErrors((p) => ({ ...p, contacts: undefined }))}
                      placeholder="Telegram @username, email или другой способ"
                      className={inputClass(errors.contacts)}
                      disabled={status === "loading"}
                    />
                  </Field>

                  {/* Сообщение */}
                  <Field label="Сообщение (опционально)" icon={MessageSquare} error={errors.message}>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Напиши что хочешь — по какому поводу пишешь, вопрос или просто привет"
                      rows={4}
                      className={`${inputClass(false)} resize-none`}
                      disabled={status === "loading"}
                    />
                  </Field>

                  {/* Кнопка */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    whileHover={status !== "loading" ? { scale: 1.01 } : {}}
                    whileTap={status !== "loading" ? { scale: 0.99 } : {}}
                    className="relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-yellow-400 py-3.5 text-base font-semibold text-black shadow-[0_0_20px_rgba(250,204,21,0.35)] transition-all hover:shadow-[0_0_32px_rgba(250,204,21,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Отправить
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-white/25">
                    Данные отправляются напрямую — никаких рассылок
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}