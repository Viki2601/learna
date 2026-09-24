export default function RouteLoading() {
    return (
        <div className="font-jost flex min-h-[calc(100vh-160px)] flex-col items-center justify-center rounded-b-xl bg-white text-[#141414] lg:min-h-[calc(100vh-104px)]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-[#B8860B]" aria-hidden="true" />
            <p className="mt-6 font-display text-2xl font-medium tracking-widest">
                Learna <span className="text-[#B8860B]">✦</span>
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.35em] text-[#8A8A8A]">Loading…</p>
            <span role="status" className="sr-only">Loading page…</span>
        </div>
    );
}
