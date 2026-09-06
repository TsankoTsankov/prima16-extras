import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Допълнителни работи PDF | Prima16 Extras" },
      {
        name: "description",
        content: "Номериран PDF за допълнителни работи и труд-и-материали. Без абонамент.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteFrame locale="bg">
      <HomePage locale="bg" />
    </SiteFrame>
  );
}
