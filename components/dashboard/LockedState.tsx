import { Lock } from "lucide-react";

type Props = {
  label?: string;
};

const LockedState = ({ label = "Hackers Only" }: Props) => {
  return (
    <div className="absolute right-4 bottom-4 z-20 flex items-center gap-1.5 rounded-full border border-border bg-backgroundMuted px-2.5 py-1">
      <Lock className="size-3 text-textMuted" />
      <p className="text-xs font-medium text-textMuted">{label}</p>
    </div>
  );
};
export default LockedState;
