import { createFileRoute } from "@tanstack/react-router";
import { StaticPageView } from "@/components/static-page";
import { parseLocale } from "@/lib/locale";
import { vsExcelPage } from "@/lib/pages";

export const Route = createFileRoute("/$locale/vs-excel")({
  component: Page,
});

function Page() {
  return <StaticPageView page={vsExcelPage(parseLocale(Route.useParams().locale))} />;
}
