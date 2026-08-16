import { createFileRoute } from "@tanstack/react-router";
import { InboxView } from "@/components/docko/inbox";

export const Route = createFileRoute("/_authenticated/app/inbox")({
  component: () => <InboxView role="student" />,
});
