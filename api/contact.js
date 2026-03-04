// api/contact.js — Vercel Serverless Function
// Токен и chat_id хранятся в Vercel Dashboard → Settings → Environment Variables
// Никогда не попадают в клиентский код и не видны в браузере

export default async function handler(req, res) {
  // Только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, contacts, message } = req.body || {};

  // Базовая валидация на сервере
  if (!name?.trim() || !contacts?.trim()) {
    return res.status(400).json({ error: "Name and contacts are required" });
  }

  const token   = process.env.TG_TOKEN;
  const chat_id = process.env.TG_CHAT_ID;

  if (!token || !chat_id) {
    console.error("Missing TG_TOKEN or TG_CHAT_ID env variables");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  // Форматируем сообщение
  const now = new Date().toLocaleString("ru-RU", {
    timeZone: "Asia/Bishkek",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const text = [
    "🔔 *Новый отклик с сайта*",
    "",
    `👤 *Имя:* ${name.trim()}`,
    `📬 *Контакт:* ${contacts.trim()}`,
    message?.trim() ? `💬 *Сообщение:* ${message.trim()}` : null,
    "",
    `⏰ ${now}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error("Telegram API error:", tgData);
      return res.status(502).json({ error: "Telegram error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}