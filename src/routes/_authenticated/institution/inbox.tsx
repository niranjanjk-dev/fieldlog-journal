import { createFileRoute } from "@tanstack/react-router";
import { InboxView } from "@/components/docko/inbox";

export const Route = createFileRoute("/_authenticated/institution/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox · Docko" },
      { name: "description", content: "Direct messages with your mentors." },
    ],
  }),
  component: InstitutionInboxPage,
});

function InstitutionInboxPage() {
  return <InboxView role="institution" />;
}
