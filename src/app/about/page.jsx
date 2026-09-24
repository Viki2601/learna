import AboutUs from "@/common/About-Us/AboutUs";
import { pageOg } from "@/lib/seo";

export default function Page() {
    return <AboutUs />;
}

const DESCRIPTION =
    "Learna is a curated interview question bank covering 54 categories and 810 modules across programming languages, frameworks, and tools. Revise the most frequently asked coding interview questions and answers, fast, before your next technical interview.";

export function generateMetadata() {
    return {
        title: "About Our Interview Question Bank",
        description: DESCRIPTION,
        keywords: ["about Learna", "interview prep about", "coding interview question bank"],
        alternates: { canonical: "/about" },
        openGraph: pageOg({
            title: "About Our Interview Question Bank | Learna",
            description: DESCRIPTION,
            path: "/about",
        }),
    };
}