import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home } from "lucide-react";

import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header spanning full width corners */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="press rounded-2xl text-xs">
            <Link to="/app">
              <Home className="size-3.5 mr-1.5" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-3xl w-full mx-auto space-y-6">
        <BentoCard className="p-6 sm:p-10 space-y-6 text-center">
          {/* Big 404 badge */}
          <div className="relative inline-flex items-center justify-center">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter text-primary/20 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Compass className="size-6 animate-spin" style={{ animationDuration: "12s" }} />
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Off the Beaten Path
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn't find the page or log you were looking for.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="press rounded-2xl px-5 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5 mr-1.5" />
              Back to Previous Page
            </Button>
          </div>
        </BentoCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground py-2">
        &copy; {new Date().getFullYear()} docko. Field Journal Integrity Platform.
      </footer>
    </div>
  );
}
