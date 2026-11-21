import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

export default async function ProfileRedirect() {
  const user = await getCurrentUser();
  redirect(user?.id ? `/profile/${user.id}` : "/sign-in");
}
