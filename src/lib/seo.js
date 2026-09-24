export const SITE_NAME = "Learna";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function pageOg({ title, description, path, type = "website" }) {
    return {
        type,
        locale: "en_US",
        siteName: SITE_NAME,
        title,
        description,
        url: path,
    };
}
