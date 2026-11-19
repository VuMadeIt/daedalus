import { Skeleton } from "@/components/ui/skeleton";
import AuthCardWrapper from "@/components/auth/AuthCardWrapper";

export default function Loading() {
  return (
    <AuthCardWrapper showTabs={false}>
      <div className="space-y-3">
        <Skeleton className="h-10 w-56 bg-black/[0.05]" />
        <Skeleton className="h-4 w-64 bg-white" />
      </div>

      <div className="space-y-5">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16 bg-black/[0.05]" />
            <Skeleton className="h-11 w-full bg-white" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-full bg-primary/20" />
      </div>
    </AuthCardWrapper>
  );
}
