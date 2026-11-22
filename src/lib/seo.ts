/** Per-page head() metadata for CampusPulse pages. */
export function pageHead(title: string, description: string) {
  const full = `${title} — CampusPulse AI`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
