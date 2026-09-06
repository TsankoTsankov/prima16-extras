import type { StaticPage } from "@/lib/pages";

export function StaticPageView({ page }: { page: StaticPage }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl">{page.title}</h1>
      <p className="mt-4 text-ink-soft">{page.lead}</p>
      <div className="mt-10 space-y-8">
        {page.blocks.map((block) => (
          <section key={block.h}>
            <h2 className="font-display text-2xl">{block.h}</h2>
            <p className="mt-2 text-ink-soft">{block.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
