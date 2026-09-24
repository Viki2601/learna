import CategoryList from '@/common/Category/List/CategoryList'
import { pageOg } from "@/lib/seo";

const DESCRIPTION =
    "Browse all 54 interview question categories — 810 modules of free Q&A across JavaScript, TypeScript, Python, React, SQL, System Design, DevOps and more.";

export default function page() {
    return <CategoryList/>;
}

export function generateMetadata() {
    return {
        title: "Browse Interview Question Categories",
        description: DESCRIPTION,
        keywords: ["interview categories", "coding topics list", "programming interview topics"],
        alternates: { canonical: "/category" },
        openGraph: pageOg({
            title: "Browse Interview Question Categories | Learna",
            description: DESCRIPTION,
            path: "/category",
        }),
    };
}