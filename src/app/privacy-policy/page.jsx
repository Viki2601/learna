import PrivacyPolicy from "@/common/Policy/PrivacyPolicy";
import { pageOg } from "@/lib/seo";

const DESCRIPTION =
    "Learn how Learna collects, uses, and protects your information when you use our interview question bank and study tools.";

export default function Page() {
    return <PrivacyPolicy />;
}

export function generateMetadata() {
    return {
        title: "Privacy Policy",
        description: DESCRIPTION,
        alternates: { canonical: "/privacy-policy" },
        openGraph: pageOg({
            title: "Privacy Policy | Learna",
            description: DESCRIPTION,
            path: "/privacy-policy",
        }),
    };
}