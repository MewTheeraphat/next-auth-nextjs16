import { describe, expect, it } from "vitest";
import { createUserSchema, updateUserSchema } from "../../lib/validation/admin";

describe("admin user validation", () => {
  it("creates regular users by default and normalizes email", () => {
    expect(
      createUserSchema.parse({
        name: " New User ",
        email: " NEW@Example.com ",
        password: "new-password",
      }),
    ).toEqual({
      name: "New User",
      email: "new@example.com",
      password: "new-password",
      isAdmin: false,
    });
  });

  it("allows explicitly granting admin access on creation", () => {
    expect(
      createUserSchema.parse({
        name: "Admin User",
        email: "admin@example.com",
        password: "secure-password",
        isAdmin: true,
      }).isAdmin,
    ).toBe(true);
  });

  it("rejects short passwords and invalid email addresses", () => {
    expect(
      createUserSchema.safeParse({
        name: "Valid User",
        email: "not-an-email",
        password: "short",
      }).success,
    ).toBe(false);
  });

  it("requires the admin flag when updating a user", () => {
    expect(
      updateUserSchema.safeParse({
        name: "Valid User",
        email: "user@example.com",
      }).success,
    ).toBe(false);
  });
});
