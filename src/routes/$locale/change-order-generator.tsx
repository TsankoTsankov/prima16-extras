import { createFileRoute } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/change-order-generator")({
  component: Page,
});

function Page() {
  return <Generator locale={parseLocale(Route.useParams().locale)} type="change_order" />;
}
