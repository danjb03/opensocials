
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-shimmer before:bg-[length:200px_100%] before:animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
