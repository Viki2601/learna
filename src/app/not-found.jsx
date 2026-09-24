import Link from "next/link";

export const metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="font-jost flex min-h-[calc(100vh-160px)] flex-col items-center justify-center rounded-b-xl bg-white px-8 text-center text-[#141414] lg:min-h-[calc(100vh-104px)]">
            <p className="font-display text-7xl font-semibold tracking-widest text-[#B8860B] md:text-[96px]">404</p>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-widest md:text-4xl">Page not found</h1>
            <p className="mt-4 max-w-md text-base tracking-widest text-[#5B5B5B]">
                The page you&apos;re looking for doesn&apos;t exist or has been moved. Head back home or browse our interview question categories.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/" className="rounded-full bg-black px-6 py-3 text-xs font-semibold tracking-widest text-white shadow-sm transition hover:bg-black/80 md:text-sm">
                    Back to home
                </Link>
                <Link href="/category" className="rounded-full border border-black/10 px-6 py-3 text-xs font-semibold tracking-widest text-[#141414] transition hover:border-black/20 md:text-sm">
                    Browse categories
                </Link>
            </div>
        </main>
    );
}
