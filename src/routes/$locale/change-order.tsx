import { createFileRoute } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/change-order")({
  head: ({ params }) => ({
    meta: [
      {
        title:
          parseLocale(params.locale) === "en"
            ? "Change order generator | Prima16 Extras"
            : "Протокол допълнителни работи | Prima16 Extras",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <Generator locale={parseLocale(Route.useParams().locale)} type="change_order" />;
}
