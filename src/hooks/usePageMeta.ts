import { useEffect } from "react";

interface PageMeta {
  title?: string;
  description?: string;
  ogImage?: string;
  /** Канонический путь, например /research/bfl-market-2026 */
  canonicalPath?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Лёгкое управление мета-тегами на клиенте (title, description, Open Graph).
 * Это базовый слой для соцпревью и заголовков вкладки. Полноценный SEO для
 * краулеров (предрендер/SSG) выносится отдельной задачей — там эти же значения
 * попадут в HTML на этапе сборки.
 */
export function usePageMeta({ title, description, ogImage, canonicalPath }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
      upsertMeta("property", "og:title", title);
    }
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }
    upsertMeta("property", "og:type", "article");
    if (ogImage) upsertMeta("property", "og:image", ogImage);
    if (canonicalPath && typeof window !== "undefined") {
      const url = window.location.origin + canonicalPath;
      upsertLink("canonical", url);
      upsertMeta("property", "og:url", url);
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, canonicalPath]);
}
