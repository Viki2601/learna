import Terms from "@/common/Terms/Terms";
import { pageOg } from "@/lib/seo";

const DESCRIPTION =
    "Read the terms and conditions for using Learna, an interview question bank for software engineers preparing for technical interviews.";

export default function Page() {
    return <Terms />;
}

export function generateMetadata() {
    return {
        title: "Terms and Conditions",
        description: DESCRIPTION,
        alternates: { canonical: "/terms" },
        openGraph: pageOg({
            title: "Terms and Conditions | Learna",
            description: DESCRIPTION,
            path: "/terms",
        }),
    };
}