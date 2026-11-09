"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "~/generated/prisma/client";
import { auth } from "~/lib/auth";
import { canChangeAdminStatus, canDeleteUser } from "~/lib/admin/policy";
import { hashPassword } from "~/lib/password";
import prisma from "~/lib/prisma";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  type AdminFormState,
} from "~/lib/validation/admin";

async function getAdminActor(tx: Prisma.TransactionClient) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const actor = await tx.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isAdmin: true },
  });

  return actor?.isAdmin ? actor : null;
}

function isDuplicateEmail(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function createUserAction(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    isAdmin: formData.get("isAdmin") === "on",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const actor = await getAdminActor(tx);

      if (!actor) {
        return false;
      }

      await tx.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash: await hashPassword(parsed.data.password),
          isAdmin: parsed.data.isAdmin,
        },
      });

      return true;
    });

    if (!created) {
      return { message: "You are not authorized to manage users." };
    }
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return { errors: { email: ["A user with this email already exists."] } };
    }

    throw error;
  }

  revalidatePath("/admin");
  return { message: "User created." };
}

export async function updateUserAction(
  userId: string,
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const parsedId = userIdSchema.safeParse(userId);
  const parsed = updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    isAdmin: formData.get("isAdmin") === "on",
  });

  if (!parsedId.success || !parsed.success) {
    return parsed.success
      ? { message: "Invalid user." }
      : { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const actor = await getAdminActor(tx);

      if (!actor) {
        return "unauthorized" as const;
      }

      const target = await tx.user.findUnique({
        where: { id: parsedId.data },
        select: { id: true, isAdmin: true },
      });

      if (!target) {
        return "not-found" as const;
      }

      const adminCount = target.isAdmin
        ? await tx.user.count({ where: { isAdmin: true } })
        : 0;

      if (
        !canChangeAdminStatus({
          actorId: actor.id,
          targetId: target.id,
          targetIsAdmin: target.isAdmin,
          nextIsAdmin: parsed.data.isAdmin,
          adminCount,
        })
      ) {
        return "protected-admin" as const;
      }

      await tx.user.update({
        where: { id: target.id },
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          isAdmin: parsed.data.isAdmin,
        },
      });

      return "updated" as const;
    });

    if (result === "unauthorized") {
      return { message: "You are not authorized to manage users." };
    }
    if (result === "not-found") {
      return { message: "User not found." };
    }
    if (result === "protected-admin") {
      return {
        message:
          "You cannot remove your own admin access or demote the last admin.",
      };
    }
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return { errors: { email: ["A user with this email already exists."] } };
    }

    throw error;
  }

  revalidatePath("/admin");
  return { message: "User updated." };
}

export async function deleteUserAction(
  userId: string,
  previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  void previousState;
  void formData;

  const parsedId = userIdSchema.safeParse(userId);

  if (!parsedId.success) {
    return { message: "Invalid user." };
  }

  const result = await prisma.$transaction(async (tx) => {
    const actor = await getAdminActor(tx);

    if (!actor) {
      return "unauthorized" as const;
    }

    const target = await tx.user.findUnique({
      where: { id: parsedId.data },
      select: { id: true, isAdmin: true },
    });

    if (!target) {
      return "not-found" as const;
    }

    const adminCount = target.isAdmin
      ? await tx.user.count({ where: { isAdmin: true } })
      : 0;

    if (!canDeleteUser(actor.id, target.id, target.isAdmin, adminCount)) {
      return "protected-admin" as const;
    }

    await tx.user.delete({ where: { id: target.id } });
    return "deleted" as const;
  });

  if (result === "unauthorized") {
    return { message: "You are not authorized to manage users." };
  }
  if (result === "not-found") {
    return { message: "User not found." };
  }
  if (result === "protected-admin") {
    return {
      message: "You cannot delete your own account or the last admin.",
    };
  }

  revalidatePath("/admin");
  return { message: "User deleted." };
}
