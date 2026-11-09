import "server-only";

import { redirect } from "next/navigation";
import prisma from "~/lib/prisma";
import { auth } from "~/lib/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return user;
}
