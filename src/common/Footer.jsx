import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full max-w-full overflow-x-hidden bg-black text-white">
      <div className="font-display tracking-widest grid gap-10 border-b border-white/10 px-8 py-16 md:grid-cols-4 md:px-16">
        <div className="md:col-span-1">
          <span className="text-xl font-semibold">Learna</span>
          <p className="mt-4 max-w-55 text-sm text-white/50">Quick recall and live practice for the hour before your next interview.</p>
        </div>

        <div>
          <p className="text-sm font-medium uppercase text-white">Product</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="cursor-pointer transition-colors hover:text-white">
              <Link href="/category">Categories</Link>
            </li>
            <li className="cursor-pointer transition-colors hover:text-white">
              <Link href="/code-editor">Code Editor</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium uppercase text-white">Company</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="cursor-pointer transition-colors hover:text-white">
              <Link href="/about">About</Link>
            </li>
            <li className="cursor-pointer transition-colors hover:text-white">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium uppercase text-white">Stay sharp</p>
          <p className="mt-4 text-sm text-white/50">One interview question a week, straight to your inbox.</p>
          <form className="mt-4 flex items-center gap-2">
            <input type="email" placeholder="you@email.com" className="w-full rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none" />
            <button type="submit" className="shrink-0 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.04]">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="relative left-1/2 right-1/2 mx-[-50vw] w-screen overflow-hidden border-b border-white/10 py-6">
        <div className="marquee-track flex w-max items-center">
          {Array.from({ length: 2 }).map((_, groupIdx) => (
            <div key={groupIdx} aria-hidden={groupIdx === 1} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6 text-6xl font-bold tracking-widest italic font-display text-white md:text-8xl">
                    Learna
                  </span>
                  <span className="text-2xl text-[#B8860B] md:text-3xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="font-display tracking-widest flex flex-col items-start justify-between gap-3 px-8 py-6 text-xs text-white/40 md:flex-row md:items-center md:px-16">
        <span>© 2026 Learna. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="cursor-pointer hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="cursor-pointer hover:text-white">
            Terms
          </Link>
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation: learna-marquee 22s linear infinite;
        }
        @keyframes learna-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
}