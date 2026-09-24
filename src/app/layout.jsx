import { Geist, Geist_Mono, Raleway, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/common/Navbar";
import { SITE_NAME, SITE_URL, pageOg } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_TITLE = "Learna — Free Interview Question Bank & Quick Recall for Software Engineers";
const SITE_DESCRIPTION ="Learna is a free interview question bank with 54 categories and 810 modules of quick Q&A — JavaScript, React, SQL, System Design and more. Skim the most-asked coding interview answers in minutes before your technical interview.";

/** @type {import("next").Metadata} */
export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "interview questions",
        "coding interview questions",
        "technical interview prep",
        "interview question bank",
        "software engineer interview",
        "quick recall interview prep",
        "JavaScript interview questions",
        "React interview questions",
        "SQL interview questions",
        "System Design interview",
        "mock interview practice",
        "programming interview Q&A",
        "free interview flashcards",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: pageOg({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: "/" }),
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${jost.variable} h-full antialiased`}>
      <body className="relative flex flex-col flex-1 items-stretch justify-center m-3 bg-black rounded-xl">
        <Navbar />
        {children}
      </body>
    </html>
  );
}