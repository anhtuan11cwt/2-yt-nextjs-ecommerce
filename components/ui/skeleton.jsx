import { cn } from "@/lib/utils";

// Component Skeleton (shadcn/ui) — placeholder loading
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
