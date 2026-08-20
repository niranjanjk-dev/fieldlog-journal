import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/docko/not-found";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page Not Found (404) · Docko" },
      { name: "description", content: "The requested fieldlog page could not be located." },
      { property: "og:title", content: "Page Not Found · Docko" },
      { property: "og:description", content: "Explore other pages in the Docko Field Journal platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotFoundPage,
});
