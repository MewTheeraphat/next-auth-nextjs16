"use server";

import { AuthError } from "next-auth";
import { Prisma } from "~/generated/prisma/client";
import { signIn, signOut } from "~/lib/auth";
import { hashPassword } from "~/lib/password";
import prisma from "~/lib/prisma";
import {
  loginSchema,
  registerSchema,
  type AuthFormState,
} from "~/lib/validation/auth";

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/user",
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { message: "Invalid email or password." };
    }

    throw error;
  }

  return { message: "Unable to sign in." };
}

export async function registerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { errors: { email: ["An account with this email already exists."] } };
    }

    throw error;
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/user",
  });

  return { message: "Your account was created. Please sign in." };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
