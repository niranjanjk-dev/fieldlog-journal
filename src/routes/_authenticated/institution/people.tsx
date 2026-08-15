import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState } from "@/components/docko/bento";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/docko";
import { peopleQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/institution/people")({
  head: () => ({
    meta: [
      { title: "People · Docko" },
      { name: "description", content: "Everyone using Docko at your institution, with their roles." },
      { property: "og:title", content: "People · Docko" },
      { property: "og:description", content: "Everyone using Docko at your institution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PeoplePage,
});

function PeoplePage() {
  const { data: people } = useQuery(peopleQuery);

  return (
    <AppShell title="People" subtitle={`${people?.length ?? 0} members`}>
      {!people || people.length === 0 ? (
        <EmptyState title="No members yet" body="Members appear here as they create Docko accounts." />
      ) : (
        <BentoCard className="p-0 sm:p-0">
          <ul className="divide-y divide-border">
            {people.map((person) => (
              <li key={person.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary-soft text-xs text-primary">
                    {initials(person.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{person.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {person.institution ?? "No institution"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {person.roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </BentoCard>
      )}
    </AppShell>
  );
}
