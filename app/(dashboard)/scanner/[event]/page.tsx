import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/auth";

import { EVENTS, type Event } from "@/config/qr-code";
import { isVolunteer } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";
import PageWrapper from "@/components/PageWrapper";
import { Scanner } from "@/components/scanner/Scanner";

const formatEventName = (event: string) => {
  return event
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default async function ScannerEventPage(props: {
  params: Promise<{ event: string }>;
}) {
  const params = await props.params;
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/sign-in");
  }

  if (!isVolunteer(currentUser.role)) {
    redirect("/qr-code");
  }

  // Validate event parameter
  const eventParam = params.event;
  if (!EVENTS.includes(eventParam as Event)) {
    notFound();
  }

  const selectedEvent = eventParam as Event;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-2">
          <div className="w-fit text-textPrimary">
            <h1 className="text-[28px] leading-tight font-medium md:text-[32px]">
              {formatEventName(selectedEvent)}
            </h1>
          </div>
          <p className="text-textMuted max-md:text-sm">
            Point the camera at a participant&apos;s QR code to check them in.
          </p>
        </div>

        <Scanner selectedEvent={selectedEvent} />
      </div>
      <BackButton href="/scanner" />
    </PageWrapper>
  );
}
