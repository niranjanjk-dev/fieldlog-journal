import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({ preset: "vercel" }),
    react(),
  ],
  server: {
    host: "::",
    port: 8080,
  },
  optimizeDeps: {
    include: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-switch",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@tanstack/react-query",
      "@tanstack/react-router"
    ],
  },
});
