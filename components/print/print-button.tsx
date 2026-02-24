"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full bg-sage-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-700"
    >
      印刷 / PDF保存
    </button>
  );
}
