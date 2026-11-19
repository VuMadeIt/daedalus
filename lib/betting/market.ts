type Pools = { yesPool: number; noPool: number };

export function marketStatus(m: { status: string; outcome: string | null }) {
  if (m.status === "resolved")
    return {
      label:
        m.outcome === "refund"
          ? "Refunded"
          : `Settled ${m.outcome?.toUpperCase()}`,
      tone: "bg-backgroundMuted text-textSecondary",
    };
  if (m.status === "closed")
    return { label: "Closed", tone: "bg-goldSoft text-goldInk" };
  return { label: "Live", tone: "bg-mint text-success" };
}

export function yesShare(m: Pools) {
  const total = m.yesPool + m.noPool;
  return total === 0 ? 50 : Math.round((m.yesPool / total) * 100);
}
