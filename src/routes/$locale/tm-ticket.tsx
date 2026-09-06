import { createFileRoute } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/tm-ticket")({
  head: ({ params }) => ({
    meta: [
      {
        title:
          parseLocale(params.locale) === "en"
            ? "T&M ticket template | Prima16 Extras"
            : "Труд и материали образец | Prima16 Extras",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <Generator locale={parseLocale(Route.useParams().locale)} type="tm_ticket" />;
}
