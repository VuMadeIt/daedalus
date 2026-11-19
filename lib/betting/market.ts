type Pools = { yesPool: number; noPool: number };

export function isTakingBets(m: { status: string; closesAt?: Date | string | null }) {
  return m.status === "open" && (!m.closesAt || new Date(m.closesAt).getTime() > Date.now());
}

export function marketStatus(m: { status: string; outcome: string | null; closesAt?: Date | string | null }) {
  if (m.status === "resolved")
    return {
      label:
        m.outcome === "refund"
          ? "Refunded"
          : `Settled ${m.outcome?.toUpperCase()}`,
      tone: "bg-backgroundMuted text-textSecondary",
    };
  if (!isTakingBets(m))
    return { label: "Closed", tone: "bg-goldSoft text-goldInk" };
  return { label: "Live", tone: "bg-mint text-success" };
}

export function yesShare(m: Pools) {
  const total = m.yesPool + m.noPool;
  return total === 0 ? 50 : Math.round((m.yesPool / total) * 100);
}
