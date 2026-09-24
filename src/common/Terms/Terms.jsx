import Link from "next/link";
import Footer from "../Footer";

export default function Terms() {
    return (
        <main className="font-jost h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl scrollbar-hide overflow-y-auto bg-white text-[#141414]">
            <article className="mx-auto max-w-full px-8 py-16 md:px-16 md:py-20">
                <h1 className="font-display text-4xl font-semibold tracking-widest md:text-5xl">Terms and Conditions</h1>
                <p className="mt-3 text-sm tracking-widest text-[#8A8A8A]">Last updated: September 24, 2026</p>
                <p className="mt-8 text-md">These Terms and Conditions (&quot;Terms&quot;) govern your use of Learna (the &quot;Site,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using Learna, you agree to be bound by these Terms. If you do not agree, please do not use the Site.</p>
                <h2 id="use-of-the-site" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Use of the Site</h2>
                <p className="mt-4 text-md">Learna provides interview preparation content — including questions, answers, explanations, and code examples — organized by programming language, framework, and tool. This content is provided for educational and personal study purposes.</p>
                <p className="mt-4 text-md">You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use of the Site. You may not attempt to scrape, bulk-download, or systematically extract content from the Site for redistribution or commercial use without our prior written permission.</p>
                <h2 id="no-guarantee" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">No Guarantee of Interview Outcomes</h2>
                <p className="mt-4 text-md">Learna is a study and revision tool. While we aim to cover questions that are commonly and frequently asked in real technical interviews, we do not guarantee that using Learna will result in a job offer, a passed interview, or any specific outcome. Interview processes vary by company, role, and interviewer, and are outside our control.</p>
                <h2 id="accuracy-of-content" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Accuracy of Content</h2>
                <p className="mt-4 text-md">We make reasonable efforts to keep the questions, answers, and code examples on Learna accurate and up to date. However, software concepts, tools, and best practices change over time, and we do not warrant that all content is complete, current, or error-free. If you notice an inaccuracy, please let us know so we can review and correct it.</p>
                <h2 id="intellectual-property" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Intellectual Property</h2>
                <p className="mt-4 text-md">All content on Learna — including questions, answers, explanations, code examples, text, graphics, logos, and the overall design — is owned by Learna or its licensors and is protected by copyright and other intellectual property laws, unless otherwise noted. You may use the content for your own personal, non-commercial study. You may not reproduce, redistribute, republish, or create derivative works from the Site&apos;s content for commercial purposes without our prior written permission.</p>
                <p className="mt-4 text-md">Third-party trademarks and logos (such as programming language and framework logos used to identify categories) belong to their respective owners and are used for identification purposes only; their use does not imply endorsement of Learna by those owners.</p>
                <h2 id="third-party-links" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Third-Party Links and Content</h2>
                <p className="mt-4 text-md">The Site may reference or link to third-party tools, documentation, or resources for context. We are not responsible for the content, accuracy, or practices of any third-party sites, and linking to them does not constitute an endorsement.</p>
                <h2 id="disclaimer" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Disclaimer of Warranties</h2>
                <p className="mt-4 text-md">The Site and its content are provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Site will be uninterrupted, secure, or error-free.</p>
                <h2 id="limitation-of-liability" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Limitation of Liability</h2>
                <p className="mt-4 text-md">To the fullest extent permitted by law, Learna and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the Site, including but not limited to any interview outcomes, missed opportunities, or reliance on content provided on the Site.</p>
                <h2 id="changes" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Changes to the Site or These Terms</h2>
                <p className="mt-4 text-md">We may modify, suspend, or discontinue any part of the Site at any time. We may also update these Terms from time to time; if we make material changes, we will update the &quot;Last updated&quot; date at the top of this page. Your continued use of the Site after changes take effect constitutes your acceptance of the updated Terms.</p>
                <h2 id="termination" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Termination</h2>
                <p className="mt-4 text-md">We reserve the right to restrict or terminate your access to the Site, at our discretion, if we believe you have violated these Terms.</p>
                <h2 id="governing-law" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Governing Law</h2>
                <p className="mt-4 text-md">These Terms are governed by the laws of India, without regard to its conflict-of-law principles.</p>
                <h2 id="contact-us" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Contact Us</h2>
                <p className="mt-4 text-md">If you have questions about these Terms, please contact us through our <Link href="/contact" className="underline underline-offset-4">Contact Us page</Link>.</p>
            </article>
            <Footer />
        </main>
    );
}