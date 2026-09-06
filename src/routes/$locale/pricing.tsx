import { createFileRoute } from "@tanstack/react-router";
import { StaticPageView } from "@/components/static-page";
import { parseLocale } from "@/lib/locale";
import { pricingPage } from "@/lib/pages";

export const Route = createFileRoute("/$locale/pricing")({
  component: Page,
});

function Page() {
  return <StaticPageView page={pricingPage(parseLocale(Route.useParams().locale))} />;
}
