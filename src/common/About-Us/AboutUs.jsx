import Link from "next/link";
import Footer from "../Footer";
import { CATEGORIES, RESULTS } from "@/lib/category";
import { ALL_QA } from "@/lib/questionAndAnswer";

const AUDIENCE = [
    "Software engineers and developers preparing for technical interviews",
    "Students and bootcamp graduates studying for their first coding interview",
    "Engineers switching stacks who need a fast refresher on a new language or framework",
    "Anyone doing a last-minute review the morning of an interview",
];

export default function AboutUs() {
    return (
        <main className="font-jost h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl scrollbar-hide overflow-y-auto bg-white text-[#141414]">
            {/* HERO */}
            <section className="px-8 pt-20 pb-16 md:px-16">
                <div className="max-w-3xl">
                    <p className="mb-5 font-display text-lg font-medium tracking-widest text-[#B8860B]">About Learna</p>
                    <h1 className="text-5xl font-display font-semibold tracking-widest leading-[1.1] md:text-[64px]">Interview prep, without the noise.</h1>
                    <p className="mt-6 tracking-widest text-lg text-[#5B5B5B]">
                        {`Learna is an interview question bank built for one moment: the hour, or the night, before a technical interview. Instead of another full course to sit through, it gives you the coding interview questions and answers that actually come up — organized by language, framework, and tool, so you can revise exactly what you need and skip the rest.`}
                    </p>
                </div>
            </section>

            {/* WHY WE BUILT LEARNA */}
            <section className="border-t border-black/5 px-8 py-16 md:px-16">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-display font-semibold tracking-widest md:text-4xl">Why we built Learna</h2>
                    <p className="mt-6 tracking-widest text-md text-[#5B5B5B]">
                        {`Most technical interview preparation is built for learning from zero. Long courses, hundreds of lecture hours, and thousands of practice problems that are meant to be worked through over months. That's the wrong shape for someone who already knows how to code and just needs to walk into a coding interview, a system design interview, or a behavioral round with the right concepts fresh in their head.`}
                    </p>
                    <p className="mt-5 tracking-widest text-md text-[#5B5B5B]">
                        {`Learna exists for that second case. It's a fast, structured way to review programming interview questions and answers across the technologies you actually use — JavaScript interview questions, React interview questions, Python interview questions, SQL interview questions, system design fundamentals, Git and DevOps basics, and more — without re-reading documentation or scrubbing through video timestamps to find the one concept you're shaky on.`}
                    </p>
                </div>
            </section>

            {/* WHAT'S INSIDE */}
            <section className="border-t border-black/5 px-8 py-16 md:px-16">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-display font-semibold tracking-widest md:text-4xl">What&apos;s inside</h2>
                    <p className="mt-6 tracking-widest text-md text-[#5B5B5B]">
                        Every topic on Learna is broken into small, focused modules — things like Closures &amp; Scope in JavaScript, Hooks Fundamentals in React, or Joins &amp; Subqueries in SQL. Each module holds the questions that are most commonly asked for that topic in real interviews, at Beginner, Intermediate, and Advanced difficulty, with clear explanations and runnable code examples where they help.
                    </p>
                    <p className="mt-5 tracking-widest text-md text-[#5B5B5B]">
                        You can browse by category, search across all topics, filter by difficulty level, and sort by what&apos;s most commonly tested — so a targeted review before an interview takes minutes, not hours.
                    </p>
                </div>
            </section>

            {/* WHO LEARNA IS FOR */}
            <section className="border-t border-black/5 px-8 py-16 md:px-16">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-display font-semibold tracking-widest md:text-4xl">Who Learna is for</h2>
                    <ul className="mt-8 grid gap-4 md:grid-cols-2">
                        {AUDIENCE.map((item) => (
                            <li key={item} className="rounded-2xl border border-black/5 p-6 tracking-widest text-md text-[#5B5B5B] transition-colors hover:bg-[#FAFAF8]">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* BY THE NUMBERS */}
            <section className="border-t border-black/5 px-8 py-16 md:px-16">
                <h2 className="text-3xl font-display font-semibold tracking-widest md:text-4xl">By the numbers</h2>
                <div className="mt-8 flex flex-wrap gap-10 font-display tracking-widest text-sm text-[#5B5B5B]">
                    <div>
                        <span className="block text-2xl font-semibold text-[#141414]">{CATEGORIES.length}+</span>
                        categories
                    </div>
                    <div>
                        <span className="block text-2xl font-semibold text-[#141414]">{ALL_QA.length}+</span>
                        questions &amp; answers
                    </div>
                    <div>
                        <span className="block text-2xl font-semibold text-[#141414]">{RESULTS.length}+</span>
                        topic modules
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-black px-8 py-20 font-display tracking-widest text-white md:px-16">
                <div className="max-w-3xl">
                    <h2 className="text-3xl font-semibold md:text-4xl">Know it cold. Walk in ready.</h2>
                    <p className="mt-4 font-jost italic text-white/70">Pick a category and start revising — or jump straight to the topics you&apos;re least confident on.</p>
                    <Link href="/category" className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]">
                        Browse categories
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}