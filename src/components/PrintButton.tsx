"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 yellow-card px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase cursor-pointer border-none hover:-translate-y-0.5 transition-transform"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        <path d="M6 14h12v8H6z" />
      </svg>
      Print Bib
    </button>
  );
}
