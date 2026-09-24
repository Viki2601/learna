"use client";
import { useEffect, useRef, useState } from "react";
import Footer from "../Footer";

const CONTACT_EMAIL = "mcvicky2601@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPIC_OPTIONS = ["Report an error", "Suggest a topic", "General feedback", "Something else"];

const CARDS = [
    { title: "Found an error?", body: "Spotted a wrong answer, outdated info, or a broken code example in one of our modules? Tell us which topic and question, and we'll get it fixed.", topic: "Report an error", },
    { title: "Missing a topic?", body: "Don't see a language, framework, or tool you're interviewing with? Let us know and we'll consider adding it.", topic: "Suggest a topic", },
    { title: "General feedback", body: "Tell us what's working, what isn't, or what would make your interview prep faster.", topic: "General feedback", },
    { title: "Something else", body: "Partnerships, press, or anything that doesn't fit above — just ask.", topic: "Something else", },
];

const EMPTY_FORM = { name: "", email: "", topic: "", message: "" };

export default function ContactUs() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [serverError, setServerError] = useState("");
    const [topicOpen, setTopicOpen] = useState(false);
    const formRef = useRef(null);
    const topicRef = useRef(null);

    // Close the topic menu on outside click or Escape
    useEffect(() => {
        if (!topicOpen) return undefined;
        const onMouseDown = (event) => {
            if (topicRef.current && !topicRef.current.contains(event.target)) setTopicOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key === "Escape") setTopicOpen(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [topicOpen]);

    const setField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    };

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Name is required.";
        if (!form.email.trim()) next.email = "Email is required.";
        else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
        if (!form.topic) next.topic = "Choose a topic.";
        if (!form.message.trim()) next.message = "Message is required.";
        return next;
    };

    const pickTopic = (topic) => {
        setField("topic", topic);
        setTopicOpen(false);
        formRef.current?.scrollIntoView({ block: "start" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        setStatus("submitting");
        setServerError("");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    topic: form.topic,
                    message: form.message.trim(),
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) {
                setStatus("success");
                setForm(EMPTY_FORM);
                setTopicOpen(false);
            } else {
                if (data.fields) setErrors((prev) => ({ ...prev, ...data.fields }));
                setServerError(data.error || "Your message wasn't sent.");
                setStatus("error");
            }
        } catch {
            setServerError("A network error occurred.");
            setStatus("error");
        }
    };

    const inputBase = "w-full rounded-full border border-black/10 bg-[#FAFAF8] py-2.5 pl-4 pr-4 text-sm tracking-widest text-[#141414] outline-none placeholder:text-[#8A8A8A] focus:border-black/20";
    const labelBase = "block text-sm font-semibold tracking-widest text-[#141414]";
    const errorBase = "mt-1.5 block text-xs text-[#C0392B]";

    return (
        <main className="font-jost h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl scrollbar-hide overflow-y-auto bg-white text-[#141414]">
            <div className="mx-auto max-w-full px-8 py-16 md:px-16 md:py-20 flex lg:flex-row flex-col justify-between">
                <div className="lg:w-1/2">
                    <p className="mb-5 font-display text-lg font-medium tracking-widest text-[#B8860B]">Get in touch</p>
                    <h1 className="text-5xl font-display font-semibold tracking-widest leading-[1.1] md:text-[64px]">We&apos;d love to hear from you.</h1>
                    <p className="mt-6 tracking-widest text-lg text-[#5B5B5B]">Whether you spotted an incorrect answer, want a language or framework we don&apos;t cover yet, or just want to say Learna helped you walk into an interview more prepared — this is the place. We read every message.</p>

                    <h2 className="mt-14 text-2xl font-semibold tracking-widest">What to reach out about</h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {CARDS.map((card) => {
                            const active = form.topic === card.topic;
                            return (
                                <button key={card.title} type="button" onClick={() => pickTopic(card.topic)} className={`rounded-2xl border p-6 text-left transition-colors ${active ? "border-black bg-[#FAFAF8]" : "border-black/5 hover:bg-[#FAFAF8]"}`}>
                                    <h3 className="text-lg font-semibold tracking-widest">{card.title}</h3>
                                    <p className="mt-2 text-sm text-[#5B5B5B]">{card.body}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <h2 className="mt-14 text-2xl font-semibold tracking-widest">Send a message</h2>
                    <form ref={formRef} aria-label="Contact Learna" onSubmit={handleSubmit} className="mt-8" noValidate>
                        {status === "success" ? (
                            <div className="rounded-2xl border border-black/5 p-8 text-center">
                                <h3 className="text-xl font-semibold tracking-widest">Message sent</h3>
                                <p className="mt-3 text-md text-[#5B5B5B]">Thanks for reaching out — we read every message. If we need to follow up, we&apos;ll reply to your email.</p>
                                <button type="button" onClick={() => { setStatus("idle"); setErrors({}); setServerError(""); }} className="mt-6 rounded-full border border-black/10 px-6 py-2.5 text-xs font-semibold tracking-widest text-[#141414] transition hover:border-black/20 md:text-sm">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-name" className={labelBase}>Name</label>
                                        <input id="contact-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={(e) => setField("name", e.target.value)}
                                            aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "contact-name-error" : undefined} placeholder="Your name"
                                            className={`mt-2 ${inputBase} ${errors.name ? "border-[#C0392B]" : ""}`}
                                        />
                                        {errors.name && <span id="contact-name-error" className={errorBase}>{errors.name}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className={labelBase}>Email</label>
                                        <input id="contact-email" name="email" type="email" autoComplete="email" required value={form.email}
                                            onChange={(e) => setField("email", e.target.value)} aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "contact-email-error" : undefined} placeholder="you@example.com"
                                            className={`mt-2 ${inputBase} ${errors.email ? "border-[#C0392B]" : ""}`}
                                        />
                                        {errors.email && <span id="contact-email-error" className={errorBase}>{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="contact-topic-trigger" className={labelBase}>Topic</label>
                                    <div ref={topicRef} className="relative mt-2">
                                        <button id="contact-topic-trigger" type="button" onClick={() => setTopicOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={topicOpen} aria-describedby={errors.topic ? "contact-topic-error" : undefined} className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border bg-[#FAFAF8] py-2.5 pl-4 pr-4 text-left text-sm tracking-widest outline-none transition-colors ${errors.topic ? "border-[#C0392B]" : "border-black/10 focus:border-black/20"} ${form.topic ? "text-[#141414]" : "text-[#8A8A8A]"}`}>
                                            <span className="truncate">{form.topic || "Choose a topic…"}</span>
                                            <svg className={`h-4 w-4 shrink-0 text-[#8A8A8A] transition-transform ${topicOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>

                                        {topicOpen && (
                                            <div role="listbox" aria-label="Topic" className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]">
                                                {TOPIC_OPTIONS.map((option) => (
                                                    <button key={option} type="button" role="option" aria-selected={form.topic === option} onClick={() => { setField("topic", option); setTopicOpen(false); }} className={`block w-full px-4 py-2.5 text-left text-sm tracking-widest transition-colors hover:bg-black/5 ${form.topic === option ? "bg-[#FAFAF8] font-semibold text-black" : "text-[#5B5B5B]"}`}>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.topic && <span id="contact-topic-error" className={errorBase}>{errors.topic}</span>}
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="contact-message" className={labelBase}>Message</label>
                                    <textarea id="contact-message" name="message" rows={5} required value={form.message} onChange={(e) => setField("message", e.target.value)}
                                        aria-invalid={errors.message ? "true" : undefined} aria-describedby={errors.message ? "contact-message-error" : undefined} placeholder="Tell us what's on your mind…"
                                        className={`mt-2 w-full rounded-2xl border border-black/10 bg-[#FAFAF8] px-4 py-3 text-sm tracking-widest text-[#141414] outline-none placeholder:text-[#8A8A8A] focus:border-black/20 ${errors.message ? "border-[#C0392B]" : ""}`}
                                    />
                                    {errors.message && <span id="contact-message-error" className={errorBase}>{errors.message}</span>}
                                </div>

                                {status === "error" && (
                                    <div role="alert" className="mt-6 rounded-2xl border border-black/5 bg-[#FBEAEA] p-4 text-sm text-[#C0392B]">
                                        {serverError ? `${serverError} ` : "Something went wrong — your message wasn't sent. "}
                                        Please email us directly at{" "}
                                        <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a> instead.
                                    </div>
                                )}

                                <button type="submit" disabled={status === "submitting"} className={`mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white transition md:text-sm ${status === "submitting" ? "cursor-not-allowed opacity-60" : "shadow-sm hover:bg-black/80"}`}>
                                    {status === "submitting" ? "Sending..." : "Send message"}
                                </button>
                            </>
                        )}
                    </form>

                    <h2 className="mt-14 text-2xl font-semibold tracking-widest">Prefer email?</h2>
                    <div className="mt-6 rounded-2xl border border-black/5 p-6 transition-colors hover:bg-[#FAFAF8]">
                        <p className="text-md">
                            You can also reach us directly at{" "}
                            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}