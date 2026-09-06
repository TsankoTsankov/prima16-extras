import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";
import { parseLocale } from "@/lib/locale";

export const Route = createFileRoute("/$locale")({
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const loc = parseLocale(locale);
  return (
    <SiteFrame locale={loc}>
      <Outlet />
    </SiteFrame>
  );
}
