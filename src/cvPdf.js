import { profileData } from "./profileData.js";

const PAGE_WIDTH_PT = 595.28;
const PAGE_HEIGHT_PT = 841.89;
const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || ctx.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function drawParagraph(ctx, text, x, y, maxWidth, lineHeight, color = "#1f2937") {
  const lines = wrapText(ctx, text, maxWidth);
  ctx.fillStyle = color;

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function drawSectionTitle(ctx, title, y) {
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillText(title, 88, y);
  return y + 22;
}

function buildCvSummary(data) {
  return {
    experience: data.experience.map((item) => `${item.title} - ${item.company}, ${item.period}`),
    skills: [...data.skills.core, ...data.skills.operations, ...data.skills.tools].slice(0, 10),
    projects: data.projects.map((item) => `${item.name} - ${item.tags.join(", ")}`),
    education: data.education.map((item) => `${item.title} - ${item.meta}, ${item.period}`),
    contacts: data.links.map((item) => `${item.label}: ${item.value}`),
  };
}

function renderCvCanvas(data) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const summary = buildCvSummary(data);
  const contentWidth = canvas.width - 176;
  let y = 102;

  ctx.fillStyle = "#020617";
  ctx.font = "700 44px Arial, sans-serif";
  ctx.fillText(data.name, 88, y);

  y += 54;
  ctx.fillStyle = "#0f172a";
  ctx.font = "400 26px Arial, sans-serif";
  ctx.fillText(data.role, 88, y);

  y += 46;
  ctx.font = "400 20px Arial, sans-serif";
  y = drawParagraph(ctx, data.tagline, 88, y, contentWidth, 30, "#334155");
  y += 24;

  const sections = [
    { title: "Опыт", items: summary.experience },
    { title: "Навыки", items: summary.skills },
    { title: "Проекты", items: summary.projects },
    { title: "Образование", items: summary.education },
    { title: "Контакты", items: summary.contacts },
  ];

  ctx.font = "400 19px Arial, sans-serif";

  sections.forEach((section) => {
    y = drawSectionTitle(ctx, section.title, y + 14);
    y += 16;

    section.items.forEach((item) => {
      ctx.fillStyle = "#0f172a";
      ctx.fillText("-", 88, y);
      y = drawParagraph(ctx, item, 110, y, contentWidth - 22, 28, "#1f2937");
      y += 6;
    });

    y += 14;
  });

  return canvas;
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function buildPdfFromJpegBytes(jpegBytes, imageWidth, imageHeight) {
  const encoder = new TextEncoder();
  const parts = [];
  let offset = 0;
  const offsets = [0];

  const pushText = (text) => {
    const bytes = encoder.encode(text);
    parts.push(bytes);
    offset += bytes.length;
  };

  const pushBinary = (bytes) => {
    parts.push(bytes);
    offset += bytes.length;
  };

  pushText("%PDF-1.4\n");

  const imageObject =
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  const pageContent = `q\n${PAGE_WIDTH_PT} 0 0 ${PAGE_HEIGHT_PT} 0 0 cm\n/Im0 Do\nQ\n`;
  const contentObject =
    `5 0 obj\n<< /Length ${encoder.encode(pageContent).length} >>\nstream\n${pageContent}endstream\nendobj\n`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
  ];

  objects.forEach((objectText) => {
    offsets.push(offset);
    pushText(objectText);
  });

  offsets.push(offset);
  pushText(imageObject);
  pushBinary(jpegBytes);
  pushText("\nendstream\nendobj\n");

  offsets.push(offset);
  pushText(contentObject);

  const xrefOffset = offset;
  pushText(`xref\n0 ${offsets.length}\n`);
  pushText("0000000000 65535 f \n");

  for (let index = 1; index < offsets.length; index += 1) {
    pushText(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }

  pushText(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(parts, { type: "application/pdf" });
}

export function downloadCvPdf() {
  const canvas = renderCvCanvas(profileData);
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const jpegBytes = dataUrlToUint8Array(jpegDataUrl);
  const pdfBlob = buildPdfFromJpegBytes(jpegBytes, canvas.width, canvas.height);
  const blobUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = "Aleksandar-CV.pdf";
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1000);
}
