import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();

  if (!session?.user && !event.url.pathname.startsWith("/auth")) {
    redirect(303, `/auth/login`);
  }

  // Set userId cookie if it doesn't exist or changed
  if (session?.user && session.user.id) {
    if (
      !event.cookies.get("userId") ||
      event.cookies.get("userId") !== session!.user.id
    ) {
      event.cookies.set("userId", session!.user.id, { path: "/" });
    }
  }

  return {
    session,
  };
};
