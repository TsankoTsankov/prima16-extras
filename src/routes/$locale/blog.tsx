import { Link, createFileRoute } from "@tanstack/react-router";
import { blogs } from "@/lib/pages";
import { parseLocale } from "@/lib/locale";
import { t } from "@/lib/copy";

export const Route = createFileRoute("/$locale/blog")({
  component: Page,
});

function Page() {
  const locale = parseLocale(Route.useParams().locale);
  const posts = locale === "en" ? blogs.en : blogs.bg;
  const c = t(locale);
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl">{c.blogTitle}</h1>
      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to="/$locale/blog/$slug" params={{ locale, slug: post.slug }} className="font-display text-2xl">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
