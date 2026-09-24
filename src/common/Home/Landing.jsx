import Image from "next/image";
import Footer from "../Footer";
import Link from "next/link";

export default function Landing() {
    return (
        <main className="font-raleway h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl scrollbar-hide overflow-y-auto bg-white text-[#141414]">
            {/* HERO */}
            <section className="relative overflow-hidden px-8 pt-20 pb-28 md:px-16">
                <div className="relative z-10 grid gap-16 md:grid-cols-2 md:items-center">
                    <div className="max-w-xl">
                        <p className="mb-5 font-display text-lg font-medium tracking-widest text-[#B8860B]">For the hour before your interview</p>
                        <h1 className="text-5xl font-display font-semibold tracking-widest leading-[1.1] md:text-[76px]">
                            <span className="italic">Know it cold.</span>
                            <br />
                            <span>Walk in ready.</span>
                        </h1>
                        <p className="mt-6 font-display tracking-widest text-lg text-[#5B5B5B]">
                            {`Learna organizes every tool, language, and concept into quick-recall questions and answers — so the night before an interview, you're skimming what matters, not rereading a whole course.`}
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <Link href={'/category'} className="text-md font-display tracking-widest font-medium text-[#141414] underline underline-offset-4">
                                Browse categories
                            </Link>
                        </div>
                        <div className="mt-12 flex gap-10 font-display tracking-widest text-sm text-[#5B5B5B]">
                            <div>
                                <span className="block text-2xl font-semibold text-[#141414]">40+</span>
                                categories
                            </div>
                            <div>
                                <span className="block text-2xl font-semibold text-[#141414]">1000+</span>
                                Q&amp;A
                            </div>
                            <div>
                                <span className="block text-2xl font-semibold text-[#141414]">300+</span>
                                mock rounds
                            </div>
                        </div>
                    </div>

                    {/* floating quick-recall card mockup */}
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-[#FDF1DD] px-3 py-1 text-xs font-medium text-[#B8860B]">JavaScript</span>
                                <span className="text-xs text-[#8A8A8A]">Question 6 of 40</span>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold font-raleway">What is a closure?</h3>
                            <p className="mt-1 text-sm text-[#5B5B5B]">Tap to reveal the explanation</p>
                            <div className="mt-5 h-2 w-full rounded-full bg-[#F1F1EF]">
                                <div className="h-2 w-2/3 rounded-full bg-black" />
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-[#8A8A8A]">
                                <span>24 of 40 reviewed</span>
                                <span>~6 min left</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 rounded-xl bg-black px-5 py-4 text-white shadow-lg">
                            <p className="text-xs text-white/60">Also inside</p>
                            <p className="text-sm font-medium">Live code editor →</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="border-t border-black/5 px-8 py-24 md:px-16 font-display">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold tracking-widest md:text-4xl">Built for the days before an interview</h2>
                    <p className="mt-4 text-[#5B5B5B] lg:italic font-jost lg:tracking-widest text-md">
                        Not another course platform. Learna is where you go to refresh fast, and where developers go to rehearse the real thing.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {[
                        { title: 'Categorized question banks', copy: 'Every tool and topic — JavaScript, React, SQL, System Design — broken into quick question-and-answer pairs you can skim in minutes.', },
                        { title: 'Interview-day quick recall', copy: 'A focused skim mode built for the hour before your interview, not a semester-long course.', },
                        { title: 'Live code editor for mock rounds', copy: 'Open a real editor, solve a prompt, and run your code — practicing the format of the actual interview, not just reading about it.', },
                    ].map((f) => (
                        <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-black/5 p-8">
                            <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-[#FDF1DD] transition-transform duration-1000 scale-180 group-hover:scale-850" />
                            <h3 className="relative text-lg tracking-widest font-semibold">{f.title}</h3>
                            <p className="relative mt-3 lg:text-sm font-jost lg:italic lg:tracking-widest text-[#5B5B5B]">{f.copy}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS — a genuine sequence, so numbering earns its place */}
            <section className="bg-[#FAFAF8] px-8 py-24 font-display lg:tracking-widest md:px-16">
                <h2 className="text-3xl font-semibold md:text-4xl tracking-widest">Three steps before you walk in</h2>
                <div className="mt-14 grid gap-10 md:grid-cols-3">
                    {[
                        { n: '01', title: 'Pick your category', copy: 'JavaScript, React, SQL, System Design, or anything else on your interview list.', },
                        { n: '02', title: 'Skim or dive deep', copy: 'Read quick Q&A for a fast refresh, or expand any answer for the full explanation.', },
                        { n: '03', title: 'Practice in the editor', copy: 'Open a mock coding round and solve real problems in a live code environment.', },
                    ].map((s) => (
                        <div key={s.n}>
                            <span className="text-lg font-medium text-[#B8860B]">{s.n}</span>
                            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                            <p className="mt-2 lg:text-sm font-jost lg:italic text-[#5B5B5B]">{s.copy}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="group relative overflow-hidden font-display tracking-widest bg-black px-8 py-20 text-white md:px-16">
                <svg className="pointer-events-none absolute -left-12 bottom-0 h-72 w-72 group-hover:scale-1300 group-hover:text-[#FAFAF8] transition-all duration-1000 text-white/0" viewBox="0 0 200 200" fill="currentColor">
                    <path d="M40 10 C 120 -10, 210 60, 190 140 C 170 210, 70 210, 30 160 C -10 110, -30 30, 40 10 Z" />
                </svg>
                <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-3xl font-semibold md:text-4xl group-hover:text-black">Your next interview starts here</h2>
                        <p className="mt-3 font-jost italic text-white/70 group-hover:text-black">Free to start. Browse a category or open the code editor right now.</p>
                    </div>
                    <Link href={'/category'} className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]">
                        Start practicing free
                    </Link>
                </div>
            </section>

            {/* TECH STACK */}
            <section className="relative border-t border-black/5 px-8 py-24 font-display tracking-widest md:px-16">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-semibold md:text-4xl">Every tool, one place</h2>
                    <p className="mt-4 text-[#5B5B5B] italic font-jost tracking-widest text-md">{`Languages, frameworks, and the tools around them — if it shows up in an interview, it's covered here.`}</p>
                </div>

                <div className="mt-14 grid grid-cols-4 gap-6 sm:grid-cols-6 md:grid-cols-8">
                    {[
                        { name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
                        { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
                        { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                        { name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
                        { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
                        { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                        { name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
                        { name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
                        { name: 'Tailwind', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
                        { name: 'Redux', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg' },
                        { name: 'GraphQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
                        { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
                        { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
                        { name: 'MySQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
                        { name: 'Docker', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
                        { name: 'Git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
                        { name: 'GitHub', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
                        { name: 'Figma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
                        { name: 'Sass', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
                        { name: 'Webpack', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg' },
                        { name: 'Vite', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
                        { name: 'Jest', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg' },
                        { name: 'AWS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
                        { name: 'Firebase', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
                    ].map(({ name, src }) => (
                        <div key={name} className="group flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden">
                                <Image src={src} alt={name} width={2300} height={23000} className="h-full w-full object-contain grayscale opacity-50 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100" />
                            </div>
                            <span className="text-xs text-[#8A8A8A]">{name}</span>
                        </div>
                    ))}
                </div>
                <Link href={'/category'} className="absolute bottom-0 right-0 px-8 py-2 bg-black text-white shadow-lg rounded-tl-2xl hover:bg-white hover:text-black hover:shadow-black transition-all duration-1000">{`View more >>`}</Link>
            </section>
            <Footer />
        </main>
    );
}