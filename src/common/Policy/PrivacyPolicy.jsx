import Link from "next/link";
import Footer from "../Footer";

export default function PrivacyPolicy() {
    return (
        <main className="font-jost h-[calc(100vh-160px)] lg:h-[calc(100vh-104px)] rounded-b-xl scrollbar-hide overflow-y-auto bg-white text-[#141414]">
            <article className="mx-auto max-w-full px-8 py-16 md:px-16 md:py-20">
                <h1 className="font-display text-4xl font-semibold tracking-widest md:text-5xl">Privacy Policy</h1>
                <p className="mt-3 text-sm tracking-widest text-[#8A8A8A]">Last updated: September 24, 2026</p>
                <p className="mt-8 text-md">This Privacy Policy explains how Learna (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information when you visit or use our website. By using Learna, you agree to the collection and use of information as described here. If you have questions about this policy, contact us.</p>
                <h2 id="information-we-collect" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Information We Collect</h2>
                <h3 className="mt-6 text-lg font-semibold tracking-widest">Information you provide directly</h3>
                <p className="mt-3 text-md">If you contact us through our <Link href="/contact" className="underline underline-offset-4">Contact Us page</Link> or by email, we collect the information you choose to include — typically your name, email address, and the content of your message. We use this only to respond to your inquiry.</p>
                <h3 className="mt-8 text-lg font-semibold tracking-widest">Information collected automatically</h3>
                <p className="mt-3 text-md">Like most websites, our servers and hosting provider automatically log standard technical information when you visit, such as your IP address, browser type, device type, pages visited, and the date and time of your visit.</p>
                <h3 className="mt-8 text-lg font-semibold tracking-widest">Cookies</h3>
                <p className="mt-3 text-md">We may use cookies or similar local storage technologies to remember your preferences (such as a selected difficulty filter or theme) and to support basic site functionality. We do not use cookies to sell your information to third parties. You can disable cookies in your browser settings, though some features of the site may not work as intended if you do.</p>
                <h2 id="how-we-use-information" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">How We Use Information</h2>
                <p className="mt-4 text-md">We use the information we collect to:</p>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-md">
                    <li>Operate, maintain, and improve Learna&apos;s content and features</li>
                    <li>Respond to questions or messages sent through our Contact Us page</li>
                    <li>Understand which topics and categories are most useful to visitors, so we can prioritize new content</li>
                    <li>Maintain the security and proper functioning of the site</li>
                    <li>Comply with legal obligations where applicable</li>
                </ul>
                <p className="mt-4 text-md">We do not sell your personal information.</p>
                <h2 id="how-we-share-information" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">How We Share Information</h2>
                <p className="mt-4 text-md">We do not share your personal information with third parties except:</p>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-md">
                    <li>With service providers who help us operate the site (such as our hosting provider), who are only permitted to use the information to provide services to us</li>
                    <li>If required by law, regulation, or valid legal process</li>
                    <li>To protect the rights, property, or safety of Learna, our users, or others</li>
                </ul>
                <h2 id="data-retention" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Data Retention</h2>
                <p className="mt-4 text-md">We retain contact form submissions for as long as needed to respond to and resolve your inquiry, and standard server logs for a limited period for security and diagnostic purposes.</p>
                <h2 id="your-choices-and-rights" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Your Choices and Rights</h2>
                <p className="mt-4 text-md">Depending on where you live, you may have rights regarding your personal information, such as the right to request access to, correction of, or deletion of the information we hold about you. To make such a request, contact us and we will respond within a reasonable timeframe.</p>
                <h2 id="childrens-privacy" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Children&apos;s Privacy</h2>
                <p className="mt-4 text-md">Learna is not directed at children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.</p>
                <h2 id="security" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Security</h2>
                <p className="mt-4 text-md">We take reasonable measures to protect the information we collect, but no method of transmission or storage over the internet is completely secure. We cannot guarantee absolute security.</p>
                <h2 id="changes-to-this-policy" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Changes to This Policy</h2>
                <p className="mt-4 text-md">We may update this Privacy Policy from time to time. If we make material changes, we will update the &quot;Last updated&quot; date at the top of this page. We encourage you to review this policy periodically.</p>
                <h2 id="contact-us" className="mt-14 scroll-mt-20 text-2xl font-semibold tracking-widest">Contact Us</h2>
                <p className="mt-4 text-md">If you have any questions about this Privacy Policy, please contact us through our <Link href="/contact" className="underline underline-offset-4">Contact Us page</Link>.</p>
            </article>
            <Footer />
        </main>
    );
}