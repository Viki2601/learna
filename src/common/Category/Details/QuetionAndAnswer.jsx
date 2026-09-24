"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Menu, X } from "lucide-react";
import { getMockTest } from "@/lib/mockTest";

export default function QuestionAndAnswer({ qaList, courseModule, category, categoryModules = [], nextModule = null, }) {
    const [openId, setOpenId] = useState(0);
    const [copied, setCopied] = useState(false);
    const [sidebarTab, setSidebarTab] = useState("questions");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [testPhase, setTestPhase] = useState("idle");
    const [testIndex, setTestIndex] = useState(0);
    const [testSelections, setTestSelections] = useState([]);
    const [testCompleted, setTestCompleted] = useState(false);

    const testQuestions = useMemo(
        () => getMockTest(courseModule || {}, qaList || []),
        [courseModule, qaList]
    );

    const scrollRef = useRef(null);
    useEffect(() => {
        if (testPhase !== "idle" && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [testPhase, testIndex]);

    // Mobile drawer: Escape to close + lock background scroll while open
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

    const groupedModules = useMemo(() => {
        const groups = { Beginner: [], Intermediate: [], Advanced: [] };
        for (const mod of categoryModules) {
            if (groups[mod.level]) {
                groups[mod.level].push(mod);
            } else {
                groups.Beginner.push(mod);
            }
        }
        return groups;
    }, [categoryModules]);

    if (!qaList || qaList.length === 0) {
        return (
            <div className="flex h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] w-full items-center justify-center rounded-b-xl bg-white p-10 text-center">
                <div className="max-w-md rounded-2xl border border-black/10 bg-[#FAFAF8] p-10">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-[#666]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#141414]">{courseModule?.title}</h3>
                    <p className="mt-2 text-sm text-[#8A8A8A]">Q&A for this module is coming soon.</p>
                    {nextModule && (
                        <Link href={`/category/${nextModule.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-semibold text-white">
                            Next Module: {nextModule.title} →
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const safeIndex = Math.min(openId, qaList.length - 1);
    const activeQuestion = qaList[safeIndex] || qaList[0];
    const isLastQuestion = safeIndex === qaList.length - 1;
    const activeTestQuestion = testQuestions[testIndex] || null;
    const activeSelection = activeTestQuestion ? testSelections[testIndex] : null;
    const testAnswered = activeSelection !== null && activeSelection !== undefined;
    const testScore = testQuestions.reduce((acc, q, i) => acc + (testSelections[i] === q.correctIndex ? 1 : 0), 0);
    const isCurrentCorrect = testAnswered && activeTestQuestion ? activeSelection === activeTestQuestion.correctIndex : false;
    const summaryMessage = testQuestions.length > 0 && testScore === testQuestions.length ? "Perfect score — you've mastered this module." : testScore >= Math.ceil(testQuestions.length * 0.6) ? "Nice work — you're ready for the next module." : "Good effort — review the questions you missed, then continue.";

    const handleCopy = () => {
        if (!activeQuestion?.example) return;
        navigator.clipboard.writeText(activeQuestion.example);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSelectQuestion = (index) => {
        setOpenId(index);
        setCopied(false);
        setTestPhase("idle");
        setSidebarOpen(false);
    };

    const handleAsideClick = (event) => {
        if (event.target.closest("a")) setSidebarOpen(false);
    };

    const startTest = () => {
        if (testQuestions.length === 0) return;
        setTestIndex(0);
        setTestSelections(Array(testQuestions.length).fill(null));
        setTestPhase("running");
    };

    const handleSelectOption = (optionIndex) => {
        if (testAnswered || !activeTestQuestion) return;
        setTestSelections((prev) => {
            const next = [...prev];
            next[testIndex] = optionIndex;
            return next;
        });
    };

    const handleNextTestQuestion = () => {
        if (testIndex < testQuestions.length - 1) {
            setTestIndex(testIndex + 1);
        } else {
            setTestCompleted(true);
            setTestPhase("done");
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] overflow-hidden rounded-b-xl bg-white text-[#141414]">
            <div aria-hidden="true" onClick={() => setSidebarOpen(false)} className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 md:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />

            <aside onClick={handleAsideClick} className={`fixed inset-y-0 left-0 z-70 flex w-80 max-w-[85vw] flex-col border-r border-black/10 bg-white shadow-2xl transition-transform duration-300 ease-out md:static md:z-auto md:w-84 md:max-w-none md:translate-x-0 md:border-t md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="shrink-0 border-b border-black/10 px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="relative flex items-center gap-2">
                            <Link href={`/category`} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5" aria-label={`Back to ${category?.name || "category"}`}>
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                            <button type="button" className="group flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium capitalize text-[#333] transition hover:border-black/30 hover:bg-[#F2F2F0]">
                                {category?.src && (
                                    <Image src={category.src} alt={category.name} width={1400} height={1400} className="h-3.5 w-3.5 object-contain" />
                                )}
                                <span>{category?.name || courseModule?.category}</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${courseModule?.level === "Beginner" ? "bg-[#EAF7EE] text-[#2E8B57]" : courseModule?.level === "Intermediate" ? "bg-[#FDF1DD] text-[#B8860B]" : "bg-[#FBEAEA] text-[#C0392B]"}`}>
                                {courseModule?.level}
                            </span>
                            <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="flex h-7 w-7 items-center justify-center rounded-full text-[#666] transition hover:bg-black/5 md:hidden">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <h2 className="mt-2.5 font-display text-lg font-bold tracking-widest text-[#141414]">{courseModule?.title}</h2>

                    {/* Quick jump to Next Module */}
                    {nextModule && (
                        <Link href={`/category/${nextModule.slug}`} className="mt-3 flex items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2 text-xs transition hover:border-black/30 hover:bg-[#F2F2F0]">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Next:</span>
                                <span className="truncate font-semibold text-[#141414]">{nextModule.title}</span>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-[#141414]">→</span>
                        </Link>
                    )}
                </div>

                {/* Sidebar Navigation Tabs */}
                <div className="flex border-b border-black/10 bg-white px-4">
                    <button type="button" onClick={() => setSidebarTab("questions")} className={`flex-1 border-b-2 py-2.5 text-xs font-bold uppercase tracking-wider transition ${sidebarTab === "questions" ? "border-black text-black" : "border-transparent text-[#888] hover:text-black"}`}>
                        Questions ({qaList.length})
                    </button>
                    <button type="button" onClick={() => setSidebarTab("modules")} className={`flex-1 border-b-2 py-2.5 text-xs font-bold uppercase tracking-wider transition ${sidebarTab === "modules" ? "border-black text-black" : "border-transparent text-[#888] hover:text-black"}`}>
                        All Modules ({categoryModules.length})
                    </button>
                </div>

                {/* Tab Content 1: Questions in Active Module */}
                {sidebarTab === "questions" && (
                    <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
                        <div className="flex flex-col gap-1.5">
                            {qaList.map((item, index) => {
                                const isActive = safeIndex === index;
                                return (
                                    <button key={index} type="button" onClick={() => handleSelectQuestion(index)} className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${isActive ? "bg-black text-white shadow-sm" : "text-[#333] hover:bg-black/5"}`}>
                                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isActive ? "bg-white text-black" : "bg-black/5 text-[#555]"}`}>
                                            {index + 1}
                                        </span>

                                        <div className="flex flex-1 flex-col">
                                            <span className={`text-xs font-medium leading-snug ${isActive ? "text-white" : "text-[#222]"}`}>
                                                {item.question}
                                            </span>
                                            {item.example && (
                                                <span className={`mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider ${isActive ? "text-white/70" : "text-[#888]"}`}>
                                                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                    </svg>
                                                    Has example
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tab Content 2: All Modules Categorized by Level */}
                {sidebarTab === "modules" && (
                    <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
                        <div className="space-y-4">
                            {["Beginner", "Intermediate", "Advanced"].map((lvl) => {
                                const list = groupedModules[lvl] || [];
                                if (list.length === 0) return null;
                                return (
                                    <div key={lvl}>
                                        <div className="mb-2 flex items-center justify-between px-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${lvl === "Beginner" ? "text-[#2E8B57]" : lvl === "Intermediate" ? "text-[#B8860B]" : "text-[#C0392B]"}`}>
                                                {lvl} ({list.length})
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {list.map((mod) => {
                                                const isCurrent = mod.slug === courseModule?.slug;
                                                return (
                                                    <Link key={mod.id || mod.slug} href={`/category/${mod.slug}`} className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition ${isCurrent ? "bg-black text-white font-semibold shadow-sm" : "text-[#333] hover:bg-black/5"}`}>
                                                        <span className="truncate pr-2">{mod.title}</span>
                                                        <div className="flex shrink-0 items-center gap-1.5">
                                                            {isCurrent ? (
                                                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">Current</span>
                                                            ) : (
                                                                <span className="text-[10px] text-[#888]">{mod.questions} Qs</span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Q&A Viewer */}
            <main className="relative flex flex-1 flex-col overflow-hidden border-t border-black/10 font-raleway">
                {/* Mobile toolbar — opens the sidebar drawer */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-2.5 md:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open questions and modules menu"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-[#141414] transition hover:bg-black/5"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="min-w-0 flex-1 truncate text-center text-xs font-semibold uppercase tracking-wider text-[#666]">
                        {courseModule?.title}
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${courseModule?.level === "Beginner" ? "bg-[#EAF7EE] text-[#2E8B57]" : courseModule?.level === "Intermediate" ? "bg-[#FDF1DD] text-[#B8860B]" : "bg-[#FBEAEA] text-[#C0392B]"}`}>
                        {courseModule?.level}
                    </span>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8 scrollbar-modern">
                    <div className="max-w-full">
                        {/* MOCK TEST — IN PROGRESS */}
                        {testPhase === "running" && activeTestQuestion && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                                            {testIndex + 1}
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">Question {testIndex + 1} of {testQuestions.length}</span>
                                    </div>
                                    <span className="rounded-md border border-black/10 bg-[#FAFAF8] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#666]">
                                        Mock Test
                                    </span>
                                </div>

                                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                                    <div className="h-full rounded-full bg-emerald-700 transition-all duration-300" style={{ width: `${((testIndex + (testAnswered ? 1 : 0)) / testQuestions.length) * 100}%` }} />
                                </div>

                                <h1 className="mt-5 font-sans leading-snug tracking-widest text-[#141414] whitespace-pre-line">
                                    {activeTestQuestion.question}
                                </h1>

                                <div className="my-5 h-px w-full bg-black/10" />

                                <section className="mb-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-bold tracking-[0.2em] text-[#666]">
                                            {testAnswered ? "Answer Locked" : "Select one answer"}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {activeTestQuestion.options.map((option, optionIndex) => {
                                            const isSelected = activeSelection === optionIndex;
                                            const isCorrectOption = optionIndex === activeTestQuestion.correctIndex;
                                            let optionClasses = "border-black/10 bg-white text-[#222] hover:border-black/40 hover:bg-[#FAFAF8]";
                                            let badgeClasses = "bg-black/5 text-[#555]";
                                            if (testAnswered) {
                                                if (isSelected && isCorrectOption) {
                                                    optionClasses = "border-emerald-700 bg-[#EAF7EE] text-[#1B5E3A]";
                                                    badgeClasses = "bg-emerald-700 text-white";
                                                } else if (isSelected && !isCorrectOption) {
                                                    optionClasses = "border-red-700 bg-[#FBEAEA] text-[#C0392B]";
                                                    badgeClasses = "bg-red-700 text-white";
                                                } else if (isCorrectOption) {
                                                    optionClasses = "border-emerald-700 bg-white text-[#2E8B57]";
                                                    badgeClasses = "bg-emerald-700 text-white";
                                                } else {
                                                    optionClasses = "border-black/10 bg-white text-black/35";
                                                }
                                            }
                                            return (
                                                <button key={optionIndex} type="button" disabled={testAnswered} onClick={() => handleSelectOption(optionIndex)} className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium leading-relaxed transition ${optionClasses} ${testAnswered ? "cursor-default" : "cursor-pointer"}`}>
                                                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeClasses}`}>
                                                        {String.fromCharCode(65 + optionIndex)}
                                                    </span>
                                                    <span className="flex-1">{option}</span>
                                                    {testAnswered && isCorrectOption && (
                                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {testAnswered && isSelected && !isCorrectOption && (
                                                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                {testAnswered && (
                                    <>
                                        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${isCurrentCorrect ? "border-emerald-200 bg-[#EAF7EE]" : "border-red-200 bg-[#FBEAEA]"}`}>
                                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${isCurrentCorrect ? "bg-emerald-700" : "bg-red-700"}`}>
                                                {isCurrentCorrect ? "✓" : "✕"}
                                            </span>
                                            <div>
                                                <p className={`text-sm font-semibold ${isCurrentCorrect ? "text-[#1B5E3A]" : "text-[#C0392B]"}`}>
                                                    {isCurrentCorrect ? "Correct!" : "Not quite."}
                                                </p>
                                                {!isCurrentCorrect && (
                                                    <p className="mt-1 text-sm leading-relaxed text-[#444]">
                                                        Correct answer:{" "}
                                                        <span className="font-semibold text-[#1B5E3A]">
                                                            {activeTestQuestion.options[activeTestQuestion.correctIndex]}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button type="button" onClick={handleNextTestQuestion} className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80">
                                            {testIndex < testQuestions.length - 1 ? "Next Question →" : "See Results →"}
                                        </button>
                                    </>
                                )}
                            </>
                        )}

                        {/* MOCK TEST — SUMMARY */}
                        {testPhase === "done" && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">✓</span>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">Test Complete</span>
                                    </div>
                                    <span className="rounded-md border border-black/10 bg-[#FAFAF8] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#666]">
                                        Mock Test
                                    </span>
                                </div>

                                <h1 className="mt-5 font-display text-xl font-bold leading-snug tracking-widest text-[#141414] md:text-2xl">
                                    You got {testScore}/{testQuestions.length} correct
                                </h1>
                                <p className="mt-2 text-sm text-[#666]">{summaryMessage}</p>

                                <div className="my-5 h-px w-full bg-black/10" />

                                <section className="mb-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-black" />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Your Results</span>
                                    </div>
                                    <div className="rounded-2xl border border-black/10 bg-[#FAFAF8] p-6">
                                        <div className="flex flex-wrap gap-2">
                                            {testQuestions.map((q, i) => {
                                                const wasCorrect = testSelections[i] === q.correctIndex;
                                                return (
                                                    <span key={i} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${wasCorrect ? "bg-emerald-700" : "bg-red-700"}`}>
                                                        {i + 1}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <p className="mt-4 text-sm text-[#666]">
                                            {nextModule ? `Up next: ${nextModule.title}` : "You've completed every module in this category."}
                                        </p>
                                    </div>
                                </section>

                                <div className="flex flex-wrap items-center gap-3">
                                    {nextModule ? (
                                        <Link href={`/category/${nextModule.slug}`} className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80">
                                            Continue to Next Module →
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-6 py-3 text-xs font-semibold text-black/40">
                                            Completed ✓
                                        </span>
                                    )}
                                    <button type="button" onClick={() => setTestPhase("idle")} className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 text-xs font-medium text-[#141414] transition hover:bg-black hover:text-white">
                                        Review Questions
                                    </button>
                                </div>
                            </>
                        )}

                        {/* QUESTION VIEWER */}
                        {testPhase === "idle" && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                                            {safeIndex + 1}
                                        </span>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#888]">Question {safeIndex + 1} of {qaList.length}</span>
                                    </div>

                                    {activeQuestion?.language && (
                                        <span className="rounded-md border border-black/10 bg-[#FAFAF8] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#666]">
                                            {activeQuestion.language}
                                        </span>
                                    )}
                                </div>

                                <h1 className="mt-5 font-display text-xl font-bold leading-snug tracking-widest text-[#141414] md:text-2xl">
                                    {activeQuestion.question}
                                </h1>

                                <div className="my-5 h-px w-full bg-black/10" />

                                {/* Concept Explanation Section */}
                                <section className="mb-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-black" />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Explanation & Concept</span>
                                    </div>
                                    <div className="rounded-2xl border border-black/10 bg-[#FAFAF8] p-6">
                                        <div className="space-y-2 text-base leading-relaxed text-[#2C2C2C]">
                                            {activeQuestion.answer.split("\n\n").map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Interactive Code / Practical Example Section */}
                                {activeQuestion.example && (
                                    <section className="mb-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Code Example</span>
                                            </div>
                                            <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1 text-xs font-medium text-[#444] shadow-sm transition hover:border-black/30 hover:bg-[#FAFAF8]">
                                                {copied ? (
                                                    <>
                                                        <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-emerald-700">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="h-3.5 w-3.5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Copy code</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#161619] shadow-xl">
                                            <div className="flex items-center justify-between border-b border-white/10 bg-[#1F1F24] px-4 py-2.5 text-xs text-white/50">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                                                    <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
                                                        {activeQuestion.language || courseModule?.category || "code"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto p-5 md:p-6">
                                                <pre className="font-mono text-xs md:text-sm leading-relaxed text-[#EDEDED] selection:bg-white/20">
                                                    <code>{activeQuestion.example}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* How It Works / Key Takeaways Section */}
                                {activeQuestion.explanation && (
                                    <section className="mb-6">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">How It Works & Key Takeaways</span>
                                        </div>
                                        <div className="rounded-2xl border border-black/10 bg-[#F4F4F2] p-6 md:p-7">
                                            <div className="space-y-2.5 text-sm md:text-base leading-relaxed text-[#333]">
                                                {activeQuestion.explanation.split("\n\n").map((para, i) => (
                                                    <p key={i}>{para}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* TAKE TEST PROMPT CARD — shown only on the last question */}
                                {nextModule && isLastQuestion && !testCompleted && (
                                    <div className="mt-10 rounded-2xl border border-black/10 bg-[#FAFAF8] p-4 transition hover:border-black/30">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#888]">Mock Test · {testQuestions.length} Questions · Optional</span>
                                                <h3 className="mt-1 font-display text-xl font-bold tracking-widest text-[#141414]">Ready for {nextModule.title}?</h3>
                                                <p className="mt-1.5 text-sm text-[#666]">Take a quick test to evaluate yourself, or move straight to the next module.</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${nextModule.level === "Beginner" ? "bg-[#EAF7EE] text-[#2E8B57]" : nextModule.level === "Intermediate" ? "bg-[#FDF1DD] text-[#B8860B]" : "bg-[#FBEAEA] text-[#C0392B]"}`}>
                                                        {nextModule.level}
                                                    </span>
                                                    <span className="text-xs text-[#888]">{nextModule.questions} questions</span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                                                <button type="button" onClick={startTest} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80">
                                                    Start Test
                                                </button>
                                                <Link href={`/category/${nextModule.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3 text-xs font-semibold text-[#141414] transition hover:bg-black hover:text-white">
                                                    Skip
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TEST COMPLETED CARD — next module ready */}
                                {nextModule && isLastQuestion && testCompleted && (
                                    <div className="mt-10 rounded-2xl border border-emerald-200 bg-[#EAF7EE]/60 p-4 transition hover:border-emerald-300">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2E8B57]">Mock Test Complete</span>
                                                <h3 className="mt-1 font-display text-xl font-bold tracking-widest text-[#141414]">You got {testScore}/{testQuestions.length} correct</h3>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#2E8B57] shadow-sm">Done ✓</span>
                                                    <span className="text-xs text-[#666]">Up next: {nextModule.title}</span>
                                                </div>
                                            </div>
                                            <Link href={`/category/${nextModule.slug}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-black/80">
                                                Continue to Next Module
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* DOCKED BOTTOM NAVIGATION */}
                <footer className="shrink-0 border-t border-black/10 bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-6">
                    <div className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2.5 sm:flex-nowrap sm:justify-between">
                        {testPhase === "running" ? (
                            <>
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#888]">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Mock Test
                                </span>

                                <div className="flex items-center gap-1.5 text-xs text-[#888]">
                                    <span className="font-semibold text-black">{testIndex + 1}</span>
                                    <span>/</span>
                                    <span>{testQuestions.length}</span>
                                </div>

                                <span className="text-right text-xs font-medium text-[#888]">
                                    {testAnswered ? testIndex < testQuestions.length - 1 ? "Next question below" : "Last question" : "Pick an answer"}
                                </span>
                            </>
                        ) : testPhase === "done" ? (
                            <>
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2E8B57]">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Test Complete
                                </span>

                                <div className="flex items-center gap-1.5 text-xs text-[#888]">
                                    <span className="font-semibold text-black">{testScore}</span>
                                    <span>/</span>
                                    <span>{testQuestions.length}</span>
                                </div>

                                {nextModule ? (
                                    <Link href={`/category/${nextModule.slug}`} className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition hover:bg-black/80">
                                        Continue to Next Module
                                    </Link>
                                ) : (
                                    <button type="button" disabled className="cursor-not-allowed rounded-full border border-black/5 px-6 py-2 text-xs md:text-sm text-black/20">
                                        Completed ✓
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button type="button" disabled={safeIndex === 0} onClick={() => handleSelectQuestion(Math.max(safeIndex - 1, 0))} className={`flex items-center gap-2 rounded-full border px-6 py-2 text-xs md:text-sm font-medium transition ${safeIndex === 0 ? "cursor-not-allowed border-black/5 text-black/20" : "border-black/20 text-[#141414] hover:bg-black hover:text-white"}`}>
                                    Previous
                                </button>

                                <div className="flex items-center gap-1.5 text-xs text-[#888]">
                                    <span className="font-semibold text-black">{safeIndex + 1}</span>
                                    <span>/</span>
                                    <span>{qaList.length}</span>
                                </div>

                                {safeIndex < qaList.length - 1 ? (
                                    <button type="button" onClick={() => handleSelectQuestion(safeIndex + 1)} className="flex items-center gap-2 rounded-full border border-black/20 px-6 py-2 text-xs md:text-sm font-medium text-[#141414] transition hover:bg-black hover:text-white">
                                        Next
                                    </button>
                                ) : nextModule ? (
                                    testCompleted ? (
                                        <Link href={`/category/${nextModule.slug}`} className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition hover:bg-black/80">
                                            Continue to Next Module
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Link href={`/category/${nextModule.slug}`} className="flex items-center gap-2 rounded-full border border-black/20 px-5 py-2 text-xs md:text-sm font-medium text-[#141414] transition hover:bg-black hover:text-white">
                                                Next Module
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <button type="button" disabled className="cursor-not-allowed rounded-full border border-black/5 px-6 py-2 text-xs md:text-sm text-black/20">
                                        Completed ✓
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </footer>
            </main>
        </div>
    );
}