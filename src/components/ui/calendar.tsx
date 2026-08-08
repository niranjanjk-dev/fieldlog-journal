"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fixedWeeks = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      className={cn(
        "bg-transparent group/calendar p-0 w-full max-w-full",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full max-w-full sm:max-w-[360px] mx-auto", defaultClassNames.root),
        months: cn("relative flex flex-col gap-3 sm:gap-4 w-full", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-2.5 sm:gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7 sm:size-9 select-none p-0 rounded-xl aria-disabled:opacity-30 hover:bg-muted transition-colors",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-7 sm:size-9 select-none p-0 rounded-xl aria-disabled:opacity-30 hover:bg-muted transition-colors",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-7 sm:h-9 w-full items-center justify-center font-bold text-sm sm:text-base text-foreground",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-7 sm:h-9 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-xl border",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-bold text-sm sm:text-base text-foreground",
          captionLayout === "label"
            ? "text-sm sm:text-base"
            : "[&>svg]:text-muted-foreground flex h-7 sm:h-9 items-center gap-1 rounded-xl pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse table-fixed",
        weekdays: cn("flex justify-between mb-1 w-full", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider",
          defaultClassNames.weekday,
        ),
        week: cn("mt-0.5 sm:mt-1 flex w-full justify-between gap-0.5 sm:gap-1", defaultClassNames.week),
        week_number_header: cn("w-8 select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-auto w-full select-none p-0 text-center flex items-center justify-center",
          defaultClassNames.day,
        ),
        range_start: cn("bg-primary text-primary-foreground rounded-l-xl", defaultClassNames.range_start),
        range_middle: cn("bg-primary-soft text-primary rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-primary text-primary-foreground rounded-r-xl", defaultClassNames.range_end),
        today: cn(
          "font-bold text-foreground",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground/35 aria-selected:text-muted-foreground/35",
          defaultClassNames.outside,
        ),
        disabled: cn("text-muted-foreground/25 opacity-35 pointer-events-none", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn("w-full max-w-full", className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-8 items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers["focused"]) ref.current?.focus();
  }, [modifiers]);

  const isSelected = Boolean(
    modifiers["selected"] &&
    !modifiers["range_start"] &&
    !modifiers["range_end"] &&
    !modifiers["range_middle"]
  );

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-has-log={Boolean(modifiers["hasLog"])}
      data-selected-single={isSelected}
      data-range-start={modifiers["range_start"]}
      data-range-end={modifiers["range_end"]}
      data-range-middle={modifiers["range_middle"]}
      className={cn(
        "relative flex aspect-square size-8 xs:size-9 sm:size-10 max-w-[42px] flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors select-none",
        isSelected && "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary hover:text-primary-foreground",
        !isSelected && modifiers["today"] && "ring-1.5 ring-primary/40 font-bold text-foreground hover:bg-muted/70",
        !isSelected && !modifiers["today"] && "hover:bg-muted/70 text-foreground",
        modifiers["disabled"] && "opacity-30 pointer-events-none",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      <span className="leading-none">{children}</span>
      {modifiers["hasLog"] ? (
        <span
          className={cn(
            "absolute bottom-0.5 sm:bottom-1 size-1 rounded-full shrink-0 transition-colors",
            isSelected ? "bg-primary-foreground" : "bg-primary",
          )}
          aria-hidden="true"
        />
      ) : null}
    </Button>
  );
}

export { Calendar, CalendarDayButton };


