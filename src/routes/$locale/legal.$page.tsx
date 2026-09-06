import { createFileRoute } from "@tanstack/react-router";
import { StaticPageView } from "@/components/static-page";
import { parseLocale } from "@/lib/locale";
import { legalPage } from "@/lib/pages";

export const Route = createFileRoute("/$locale/legal/$page")({
  component: Page,
});

function Page() {
  const { locale, page } = Route.useParams();
  return <StaticPageView page={legalPage(parseLocale(locale), page)} />;
}
