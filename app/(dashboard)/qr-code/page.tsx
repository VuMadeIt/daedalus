import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import { QRCodeSVG } from "qrcode.react";

import { QR_LOGO_SRC } from "@/config/qr-code";
import { BackButton } from "@/components/ui/back-button";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";
import { QRCodeActions } from "@/components/qr-code/QRCodeActions";

export default async function QRCodePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/sign-in");
  }

  if (currentUser.role === "unassigned") {
    return (
      <EmptyPage
        title="QR Code Page"
        message="Sorry, this feature is only available to participants."
      />
    );
  }

  const profileUrl = `https://app.hackcanada.org/profile/${currentUser.id}`;

  const role = currentUser.role ? currentUser.role[0].toUpperCase() + currentUser.role.slice(1) : "Hacker";

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-1.5">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">
            Your pass
          </h1>
          <p className="text-[15px] text-textSecondary">
            Show this at check-in, meals and workshops. It also opens your public profile.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl bg-ink text-white shadow-float">
            <div className="absolute -top-20 -right-16 size-56 rounded-full bg-primary/50 blur-3xl" aria-hidden />
            <div className="absolute -bottom-24 -left-16 size-56 rounded-full bg-gold/25 blur-3xl" aria-hidden />
            <div className="relative flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-2.5">
                <Image src="/logo-circle.png" alt="" width={32} height={32} className="size-8 rounded-full" />
                <div className="leading-tight">
                  <p className="text-sm font-bold">Hack Canada</p>
                  <p className="text-xs text-white/60">2027</p>
                </div>
              </div>
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">{role}</span>
            </div>
            <div className="relative px-6 pt-8 pb-6">
              <p className="text-xs tracking-[0.18em] text-white/50 uppercase">Name</p>
              <p className="mt-1 truncate text-2xl font-bold tracking-tight">{currentUser.name || "Hacker"}</p>
            </div>
            <div className="relative border-t border-dashed border-white/20 px-6 py-7">
              <div className="mx-auto w-fit rounded-2xl bg-white p-4">
                <QRCodeSVG
                  data-qr-code="true"
                  value={profileUrl}
                  size={220}
                  level="H"
                  imageSettings={{ src: QR_LOGO_SRC, height: 56, width: 56, excavate: true }}
                />
              </div>
              <p className="mt-4 text-center text-xs text-white/60">Scan to check in or view profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <h2 className="text-base font-bold text-textPrimary">Keep it handy</h2>
              <p className="mt-1 text-sm text-textSecondary">
                Save it to your phone or send it to your email so it works even without Wi-Fi.
              </p>
              <div className="mt-4">
                <QRCodeActions
                  userId={currentUser.id}
                  userName={currentUser.name || "Hacker"}
                  userEmail={currentUser.email || ""}
                  profileUrl={profileUrl}
                />
              </div>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ["Check-in", "Scan at the front desk"],
                ["Meals", "Scan at every food line"],
                ["Profile", "Other hackers scan it to see your links"],
              ].map(([t, b]) => (
                <li key={t} className="bg-surface p-4">
                  <p className="text-sm font-bold text-textPrimary">{t}</p>
                  <p className="mt-0.5 text-sm text-textMuted">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <BackButton />
    </PageWrapper>
  );
}
