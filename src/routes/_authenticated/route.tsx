import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { getDevMe, isDevModeActive } from "@/lib/dev-mode";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return { user: data.user };
      }
    } catch {
      // Fall through to dev mode check
    }

    if (isDevModeActive()) {
      const devMe = getDevMe();
      return {
        user: {
          id: devMe.id,
          email: devMe.email,
          user_metadata: { full_name: devMe.fullName },
        },
      };
    }

    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
