import { Link, createFileRoute } from "@tanstack/react-router";
import { t } from "@/lib/copy";
import { exampleIndex } from "@/lib/defaults";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/examples")({
  component: Page,
});

function Page() {
  const locale = parseLocale(Route.useParams().locale);
  const c = t(locale);
  const items = exampleIndex.filter((item) => item.locale === locale || item.locale === "en");
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl">{c.examplesTitle}</h1>
      <p className="mt-3 text-ink-soft">{c.heroSub}</p>
      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              to="/$locale/examples/$slug"
              params={{ locale, slug: item.slug }}
              className="block rounded-[14px] border border-line bg-card px-4 py-3"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
