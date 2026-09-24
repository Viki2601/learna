import ContactUs from '@/common/Contact-Us/ContactUs'
import { pageOg } from "@/lib/seo";

const DESCRIPTION =
    "Have a question, found an error, or want to suggest a topic? Get in touch with the Learna team — we read every message.";

export default function page() {
    return <ContactUs />
}

export function generateMetadata() {
    return {
        title: "Contact Us",
        description: DESCRIPTION,
        keywords: ["contact Learna", "feedback", "report an error", "suggest a topic"],
        alternates: { canonical: "/contact" },
        openGraph: pageOg({
            title: "Contact Us | Learna",
            description: DESCRIPTION,
            path: "/contact",
        }),
    };
}