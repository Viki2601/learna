import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="sticky inset-0 top-0 z-50 w-full h-20 bg-white flex items-center rounded-t-xl justify-between px-8 overflow-hidden">
            {/* Diagonal shape accent */}
            <div className="absolute top-0 right-0 h-full w-[25%] border border-black bg-black" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 25% 100%)', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.05)', }} />

            {/* Left: logo + links */}
            <div className="relative z-10 flex items-center gap-10">
                <Link href={"/"} className="font-bold font-display text-3xl tracking-widest text-black">Learna</Link>
            </div>

            {/* Right: angled black CTA */}
            <div className="relative z-10 h-full flex items-center bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', paddingLeft: '2.5rem', paddingRight: '2rem', marginRight: '-2rem', }}>
                <Link href="/contact" className="text-white tracking-widest text-sm font-display font-medium whitespace-nowrap cursor-pointer hover:shadow-md hover:shadow-amber-900 hover:bg-stone-900 hover:rounded-lg hover:px-5 hover:py-2 transition-all duration-1000" >
                    Contact Us!
                </Link>
            </div>
        </nav>
    );
}