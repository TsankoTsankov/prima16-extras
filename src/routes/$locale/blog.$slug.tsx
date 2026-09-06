import { createFileRoute } from "@tanstack/react-router";
import { blogs } from "@/lib/pages";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/blog/$slug")({
  component: Page,
});

function Page() {
  const { locale: raw, slug } = Route.useParams();
  const locale = parseLocale(raw);
  const posts = locale === "en" ? blogs.en : blogs.bg;
  const post = posts.find((item) => item.slug === slug) ?? posts[0];
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl">{post.title}</h1>
      <p className="mt-6 text-lg text-ink-soft">{post.body}</p>
    </main>
  );
}
