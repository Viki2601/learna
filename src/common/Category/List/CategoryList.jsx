"use client";
import { CATEGORIES, RESULTS } from "@/lib/category";
import { getQAByModuleSlug } from "@/lib/questionAndAnswer";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { Menu, X } from "lucide-react";

const SORT_OPTIONS = ["Most questions", "A–Z", "Recently added"];
const LEVEL_OPTIONS = ["All levels", "Beginner", "Intermediate", "Advanced"];

export default function CategoryList() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
    const [sortOpen, setSortOpen] = useState(false);
    const [activeLevel, setActiveLevel] = useState(LEVEL_OPTIONS[0]);
    const [levelOpen, setLevelOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mobile browse drawer: Escape to close + lock background scroll while open
    useEffect(() => {
        if (!sidebarOpen) return undefined;
        const onKeyDown = (event) => {
            if (event.key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        let previousOverflow = "";
        if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [sidebarOpen]);

    // Dynamic question counts synced with actual loaded Q&A dataset
    const enrichedResults = useMemo(() => {
        return RESULTS.map((r) => {
            const actualCount = getQAByModuleSlug(r.slug).length;
            return { ...r, questions: actualCount > 0 ? actualCount : r.questions, };
        });
    }, []);

    const categoryCounts = useMemo(() => {
        const counts = {};
        for (const r of enrichedResults) {
            counts[r.category] = (counts[r.category] || 0) + 1;
        }
        return counts;
    }, [enrichedResults]);

    const filteredCategories = useMemo(() => {
        if (!categorySearch.trim()) return CATEGORIES;
        const q = categorySearch.trim().toLowerCase();
        return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
    }, [categorySearch]);

    const filtered = useMemo(() => {
        let list = enrichedResults;

        if (activeCategory !== "all") {
            list = list.filter((r) => r.category === activeCategory);
        }
        if (search.trim()) {
            list = list.filter((r) => r.title.toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (activeLevel !== "All levels") {
            list = list.filter((r) => r.level === activeLevel);
        }
        if (sortBy === "A–Z") {
            list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "Most questions") {
            list = [...list].sort((a, b) => b.questions - a.questions);
        }
        return list;
    }, [enrichedResults, activeCategory, search, sortBy, activeLevel]);

    return (
        <div className="flex w-full h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl overflow-hidden bg-white text-[#141414]">
            <div aria-hidden="true" onClick={() => setSidebarOpen(false)} className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 md:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />
            <aside className={`fixed inset-y-0 left-0 z-70 flex w-72 max-w-[85vw] shrink-0 flex-col overflow-y-auto border-r border-black/5 bg-white px-6 scrollbar-hide shadow-2xl transition-transform duration-300 ease-out md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="sticky top-0 bg-white py-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold tracking-widest font-display text-[#8A8A8A]">BROWSE</p>
                        <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close browse menu" className="flex h-7 w-7 items-center justify-center rounded-full text-[#666] transition hover:bg-black/5 md:hidden">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="relative mt-4">
                        <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8A8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="Search categories..." className="w-full rounded-full border border-black/10 bg-[#FAFAF8] py-2 pl-9 pr-3 text-xs tracking-widest text-[#141414] outline-none placeholder:text-[#8A8A8A] focus:border-black/20" />
                    </div>
                </div>

                <nav className="mt-4 flex flex-col gap-1 pb-6 font-raleway">
                    <button onClick={() => { setActiveCategory("all"); setSidebarOpen(false); }} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm tracking-widest transition-colors ${activeCategory === "all" ? "bg-black text-white" : "text-[#5B5B5B] hover:bg-black/5"}`}>
                        All categories
                        <span className={`text-xs ${activeCategory === "all" ? "text-white/60" : "text-[#8A8A8A]"}`}>
                            {RESULTS.length}
                        </span>
                    </button>

                    {filteredCategories.length === 0 ? (
                        <p className="px-3 py-4 text-xs tracking-widest text-[#8A8A8A]">No categories match.</p>
                    ) : (
                        filteredCategories.map(({ id, name, src }) => (
                            <button key={id} onClick={() => { setActiveCategory(id); setSidebarOpen(false); }} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm tracking-widest transition-colors ${activeCategory === id ? "bg-black text-white" : "text-[#5B5B5B] hover:bg-black/5"}`}>
                                <span className="flex items-center gap-2.5 font-semibold text-xs">
                                    <Image src={src} alt={name} width={2600} height={2700} className={`h-4 w-4 object-contain ${activeCategory === id ? "brightness-0 invert" : ""}`} />
                                    {name}
                                </span>
                                <span className={`text-xs ${activeCategory === id ? "text-white/60" : "text-[#8A8A8A]"}`}>
                                    {categoryCounts[id] || 0}
                                </span>
                            </button>
                        ))
                    )}
                </nav>
            </aside>

            {/* MAIN */}
            <div className="flex flex-1 flex-col overflow-hidden font-raleway">
                {/* TOPBAR */}
                <div className="flex flex-col gap-3 bg-white border-b border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 md:px-10">
                    <div className="flex w-full items-center gap-2.5 sm:max-w-sm sm:gap-4">
                        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open browse categories menu" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#141414] transition hover:bg-black/5 md:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="relative flex-1">
                            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics..." className="w-full rounded-full border border-black/10 bg-[#FAFAF8] py-2.5 pl-10 pr-4 text-sm tracking-widest text-[#141414] outline-none placeholder:text-[#8A8A8A] focus:border-black/20" />
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-[11px] tracking-widest text-[#8A8A8A] sm:text-xs">
                            {filtered.length} {filtered.length === 1 ? "result" : "results"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="relative">
                            <button onClick={() => setLevelOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-xs tracking-widest text-[#5B5B5B] hover:border-black/20 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
                                {activeLevel}
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {levelOpen && (
                                <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]">
                                    {LEVEL_OPTIONS.map((opt) => (
                                        <button key={opt} onClick={() => { setActiveLevel(opt); setLevelOpen(false); }} className={`block w-full px-4 py-2.5 text-left text-sm tracking-widest hover:bg-black/5 ${activeLevel === opt ? "text-black" : "text-[#5B5B5B]"}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SORT */}
                        <div className="relative">
                            <button onClick={() => setSortOpen((o) => !o)} className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-xs tracking-widest text-[#5B5B5B] hover:border-black/20 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
                                {sortBy}
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {sortOpen && (
                                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]">
                                    {SORT_OPTIONS.map((opt) => (
                                        <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} className={`block w-full px-4 py-2.5 text-left text-sm tracking-widest hover:bg-black/5 ${sortBy === opt ? "text-black" : "text-[#5B5B5B]"}`}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RESULTS GRID */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 sm:px-6 sm:py-8 md:px-10">
                    {filtered.length === 0 ? (
                        <p className="mt-20 text-center text-sm tracking-widest text-[#8A8A8A]">No topics match your search.</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                            {filtered.map((item) => {
                                const cat = CATEGORIES.find((c) => c.id === item.category);
                                return (
                                    <Link key={item.id} href={`/category/${item.slug}`} className="group flex items-start gap-4 rounded-2xl border border-black/5 p-4 transition-colors hover:border-black/10 hover:bg-[#FAFAF8] sm:gap-5 sm:p-6">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden">
                                            {cat && (
                                                <Image src={cat.src} alt={cat.name} width={2600} height={2700} className="h-full w-full object-contain" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-md tracking-wide wrap-break-words">{item.title}</h3>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs tracking-widest text-[#8A8A8A]">
                                                <span>{item.questions} questions</span>
                                                <span className="h-1 w-1 rounded-full bg-[#D9D9D9]" />
                                                <span className={`rounded-full px-4 py-1 sm:px-5 ${item.level === "Beginner" ? "bg-[#EAF7EE] text-[#2E8B57]" : item.level === "Intermediate" ? "bg-[#FDF1DD] text-[#B8860B]" : "bg-[#FBEAEA] text-[#C0392B]"}`}>
                                                    {item.level}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}