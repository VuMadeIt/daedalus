import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyPageProps {
  title: string;
  message: string;
}

export const EmptyPage = ({ title, message }: EmptyPageProps) => {
  return (
    <div className="flex min-h-[calc(100svh-64px)] flex-col items-center justify-center px-6 text-center lg:min-h-svh">
      <div className="motion-safe:animate-bob flex flex-col items-center">
        <Image
          src="/scenes/bottle.png"
          alt=""
          width={346}
          height={277}
          className="h-28 w-auto -rotate-12"
        />
        <span className="mt-2 h-2 w-3/4 rounded-full bg-black/[0.05] blur-sm" />
      </div>
      <h1 className="font-display mt-8 text-4xl text-balance text-textPrimary md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-white/65">{message}</p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary py-2 pr-2 pl-6 font-medium text-white transition-colors hover:bg-primaryDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Back home
        <span className="grid size-9 place-items-center rounded-full bg-ink text-textPrimary">
          <ArrowRight
            className="size-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
            aria-hidden
          />
        </span>
      </Link>
    </div>
  );
};
