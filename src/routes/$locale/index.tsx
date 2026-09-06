import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const loc = parseLocale(params.locale);
    return {
      meta: [
        {
          title:
            loc === "en"
              ? "Change order PDF for trades | Prima16 Extras"
              : "Допълнителни работи PDF | Prima16 Extras",
        },
      ],
    };
  },
  component: LocaleHome,
});

function LocaleHome() {
  const loc = parseLocale(Route.useParams().locale);
  return <HomePage locale={loc} />;
}
