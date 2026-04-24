// src/lib/seo.ts

type FAQ = { q: string; a: string };

interface SEOData {
  title: string;
  description: string;
  path: string;
  faqs?: FAQ[];
}

const BASE_URL = "https://vision.aivoro.site";

export const updateSEO = (page: string) => {

  const pages: Record<string, SEOData> = {
    home: {
      title: "Vision AI Tools – Free Online Calculators & Smart Tools",
      description:
        "Free online calculators, converters, and AI tools. Solve math problems, convert units, and boost productivity instantly.",
      path: "/"
    },

    scientific: {
      title: "Scientific Calculator – Free Online Advanced Calculator",
      description:
        "Use our free scientific calculator with trigonometry, logs, powers, and advanced math functions instantly.",
      path: "/scientific",
      faqs: [
        {
          q: "Does it support trigonometric functions?",
          a: "Yes, it supports sine, cosine, and tangent functions."
        },
        {
          q: "How do I calculate square root?",
          a: "Use sqrt(x). Example: sqrt(16) = 4."
        }
      ]
    },

    percentage: {
      title: "Percentage Calculator – Fast & Accurate Online Tool",
      description:
        "Calculate percentage increase, decrease, and ratios instantly using our free online percentage calculator.",
      path: "/percentage"
    },

    "word-counter": {
      title: "Word Counter – Count Words, Characters & Reading Time",
      description:
        "Free word counter tool to count words, characters, sentences, and estimate reading time instantly.",
      path: "/word-counter"
    }
  };

  const data = pages[page] || pages.home;

  /* ===========================
     BASIC META TAGS
  =========================== */

  document.title = data.title;

  const setMeta = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setMeta("description", data.description);

  /* ===========================
     OPEN GRAPH (Facebook)
  =========================== */

  const setOG = (prop: string, content: string) => {
    let tag = document.querySelector(`meta[property="${prop}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", prop);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setOG("og:title", data.title);
  setOG("og:description", data.description);
  setOG("og:type", "website");
  setOG("og:url", BASE_URL + data.path);

  /* ===========================
     TWITTER
  =========================== */

  const setTwitter = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setTwitter("twitter:card", "summary_large_image");
  setTwitter("twitter:title", data.title);
  setTwitter("twitter:description", data.description);

  /* ===========================
     CANONICAL
  =========================== */

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", BASE_URL + data.path);

  /* ===========================
     REMOVE OLD SCHEMA (IMPORTANT)
  =========================== */

  const old = document.getElementById("seo-schema");
  if (old) old.remove();

  /* ===========================
     STRUCTURED DATA (SEO + AEO)
  =========================== */

  const schemas: any[] = [];

  // WebSite Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vision AI Tools",
    "url": BASE_URL
  });

  // WebPage Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.description,
    "url": BASE_URL + data.path
  });

  // FAQ Schema (ONLY ONE – FIXED)
  if (data.faqs && data.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  const script = document.createElement("script");
  script.id = "seo-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schemas);

  document.head.appendChild(script);
};