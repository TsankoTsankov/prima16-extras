import { createFileRoute } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/tm-ticket-template")({
  component: Page,
});

function Page() {
  return <Generator locale={parseLocale(Route.useParams().locale)} type="tm_ticket" />;
}
