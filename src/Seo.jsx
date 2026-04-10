import { useEffect } from "react";

const SITE_NAME = "The Aleksandar Space • Aleksandar Portfolio";
const SITE_URL = "https://franko.best";
const DEFAULT_IMAGE = `${SITE_URL}/preview.jpg`;

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

function ensureLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

export default function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const imageUrl = image.startsWith("http") ? image : new URL(image, SITE_URL).toString();

    document.title = pageTitle;
    document.documentElement.lang = "ru";

    ensureMeta('meta[name="description"]', { name: "description" }).setAttribute("content", description);
    ensureMeta('meta[name="robots"]', { name: "robots" }).setAttribute("content", "index, follow");
    ensureMeta('meta[property="og:title"]', { property: "og:title" }).setAttribute("content", pageTitle);
    ensureMeta('meta[property="og:description"]', { property: "og:description" }).setAttribute("content", description);
    ensureMeta('meta[property="og:type"]', { property: "og:type" }).setAttribute("content", type);
    ensureMeta('meta[property="og:url"]', { property: "og:url" }).setAttribute("content", canonicalUrl);
    ensureMeta('meta[property="og:image"]', { property: "og:image" }).setAttribute("content", imageUrl);
    ensureMeta('meta[property="og:site_name"]', { property: "og:site_name" }).setAttribute("content", SITE_NAME);
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card" }).setAttribute("content", "summary_large_image");
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title" }).setAttribute("content", pageTitle);
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description" }).setAttribute("content", description);
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image" }).setAttribute("content", imageUrl);

    ensureLink('link[rel="canonical"]', { rel: "canonical" }).setAttribute("href", canonicalUrl);

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: "Portfolio website of Aleksandar with frontend projects, technical reviews and contact information.",
        },
        {
          "@type": "Person",
          name: "Aleksandar",
          url: SITE_URL,
          jobTitle: "Frontend Developer",
          description: "Aleksandar portfolio website with frontend projects, technical reviews and contact information.",
          sameAs: [
            "https://github.com/frankoleet",
            "https://t.me/frankoleet",
          ],
        },
      ],
    };

    let script = document.head.querySelector('script[data-seo="structured-data"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "structured-data");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [title, description, path, image, type]);

  return null;
}
