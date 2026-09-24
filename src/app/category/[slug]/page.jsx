import { notFound } from "next/navigation";
import { CATEGORIES, RESULTS } from "@/lib/category";
import { getQAByModuleSlug } from "@/lib/questionAndAnswer";
import QuestionAndAnswer from "@/common/Category/Details/QuetionAndAnswer";
import { pageOg } from "@/lib/seo";

const LEVEL_STYLES = {
    Beginner: "bg-[#EAF7EE] text-[#2E8B57]",
    Intermediate: "bg-[#FDF1DD] text-[#B8860B]",
    Advanced: "bg-[#FBEAEA] text-[#C0392B]",
};

export default async function Page({ params }) {
    const { slug } = await params;
    const courseModule = RESULTS.find((r) => r.slug === slug);
    if (!courseModule) notFound();
    const cat = CATEGORIES.find((c) => c.id === courseModule.category);
    const qaList = getQAByModuleSlug(slug);
    const categoryModules = RESULTS.filter((r) => r.category === courseModule.category).map((mod) => ({ ...mod, questions: getQAByModuleSlug(mod.slug).length || mod.questions }));
    const currentIndex = categoryModules.findIndex((r) => r.slug === courseModule.slug);
    const nextModule = currentIndex >= 0 && currentIndex < categoryModules.length - 1 ? categoryModules[currentIndex + 1] : null;
    const prevModule = currentIndex > 0 ? categoryModules[currentIndex - 1] : null;
    const courseModuleWithRealCount = { ...courseModule, questions: qaList.length || courseModule.questions };

    return (
        <QuestionAndAnswer
            qaList={qaList} courseModule={courseModuleWithRealCount} category={cat} LEVEL_STYLES={LEVEL_STYLES} categoryModules={categoryModules}
            nextModule={nextModule} prevModule={prevModule} allCategories={CATEGORIES} allResults={RESULTS}
        />
    );
}

// Pre-render every module page at build time for fast, static loads
export function generateStaticParams() {
    return RESULTS.map((r) => ({ slug: r.slug }));
}

// Per-page <title> and SEO tags in the browser tab and search results
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const courseModule = RESULTS.find((r) => r.slug === slug);
    // Throw before streaming starts so unknown slugs return a real 404 status
    if (!courseModule) notFound();
    const cat = CATEGORIES.find((c) => c.id === courseModule.category);
    const catName = cat ? cat.name : "Programming";
    const title = `${courseModule.title} Interview Questions`;
    const description = `${courseModule.questions} ${courseModule.level.toLowerCase()}-level ${courseModule.title} interview Q&A for ${catName} — quick answers and full explanations. Free ${catName} interview prep on Learna.`;
    return {
        title,
        description,
        keywords: [
            `${courseModule.title} interview questions`,
            `${catName} interview questions`,
            `${catName} Q&A`,
            "coding interview prep",
        ],
        alternates: { canonical: `/category/${slug}` },
        openGraph: pageOg({
            title: `${title} | Learna`,
            description,
            path: `/category/${slug}`,
            type: "article",
        }),
    };
}