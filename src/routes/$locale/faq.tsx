import { createFileRoute } from "@tanstack/react-router";
import { StaticPageView } from "@/components/static-page";
import { parseLocale } from "@/lib/locale";
import { faqPage } from "@/lib/pages";

export const Route = createFileRoute("/$locale/faq")({
  component: Page,
});

function Page() {
  return <StaticPageView page={faqPage(parseLocale(Route.useParams().locale))} />;
}
