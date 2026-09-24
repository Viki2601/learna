import { RESULTS } from "@/lib/category";
import { SITE_URL } from "@/lib/seo";

const STATIC_PAGES = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/category", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap() {
    const lastModified = new Date();
    const staticUrls = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
        url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
        lastModified,
        changeFrequency,
        priority,
    }));
    const moduleUrls = RESULTS.map((module) => ({
        url: `${SITE_URL}/category/${module.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
    }));
    return [...staticUrls, ...moduleUrls];
}
