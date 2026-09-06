import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paddle/webhook")({
  server: {
    handlers: {
      POST: async () =>
        Response.json({
          ok: true,
          note: "Sandbox webhook endpoint. Wire Paddle products before production.",
        }),
    },
  },
});
