import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PageWrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto h-full w-full max-w-[1180px] space-y-6 px-4 pt-6 pb-16 sm:px-6 md:space-y-8 lg:px-10 lg:pt-2 lg:pb-20",
        className,
      )}
    >
      {children}
    </div>
  );
};
export default PageWrapper;
