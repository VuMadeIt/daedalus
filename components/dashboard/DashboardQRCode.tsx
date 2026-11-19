import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { QR_LOGO_SRC } from "@/config/qr-code";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DashCard } from "./DashCard";

interface DashboardQRCodeProps {
  isLocked: boolean;
  userId: string;
}

const DashboardQRCode = ({ isLocked, userId }: DashboardQRCodeProps) => {
  const profileUrl = `https://app.hackcanada.org/profile/${userId}`;

  return (
    <DashCard
      title="Your hacker pass"
      icon={<QrCode />}
      tone="coral"
      locked={isLocked && "Participants only"}
      description="Show this at check-in, at meals and at workshops. Anyone who scans it lands on your profile."
      action={
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isLocked}>
              Show my pass
              <QrCode className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-w-sm flex-col items-center">
            <DialogHeader className="items-center text-center">
              <DialogTitle className="md:text-xl">Your hacker pass</DialogTitle>
            </DialogHeader>
            <div className="mt-2 rounded-2xl border border-border bg-white p-4 shadow-card">
              <QRCodeSVG
                value={profileUrl}
                size={225}
                level="H"
                imageSettings={{
                  src: QR_LOGO_SRC,
                  height: 50,
                  width: 50,
                  excavate: true,
                }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-balance text-textMuted">
              Hold it up at check-in. Friends can scan it to find your profile.
            </p>
          </DialogContent>
        </Dialog>
      }
    />
  );
};

export default DashboardQRCode;
