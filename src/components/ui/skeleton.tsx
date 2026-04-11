import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer rounded-md", className)}
      {...props}
    />
  );
}

const cardSkeletonVariants = cva("space-y-3", {
  variants: {
    variant: {
      default: "",
      compact: "space-y-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardSkeletonVariants> {}

function CardSkeleton({ className, variant, ...props }: CardSkeletonProps) {
  return (
    <div
      className={cn("rounded-lg border bg-card p-6", cardSkeletonVariants({ variant }), className)}
      {...props}
    >
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

function ExamCardSkeleton() {
  return (
    <CardSkeleton>
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardSkeleton>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 bg-muted rounded-t-lg">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, CardSkeleton, ExamCardSkeleton, TableSkeleton };
