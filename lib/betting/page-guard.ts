import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

import { getUserPoints } from "@/lib/db/queries/points";

export async function loadBettor() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");
  const points = await getUserPoints(user.id);
  return { user, userId: user.id, points, allowed: user.role !== "unassigned" };
}
