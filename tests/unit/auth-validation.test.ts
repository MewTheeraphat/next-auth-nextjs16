import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../../lib/validation/auth";

describe("loginSchema", () => {
  it("trims and lowercases email addresses", () => {
    expect(
      loginSchema.parse({
        email: "  USER@Example.com ",
        password: "pass",
      }),
    ).toEqual({
      email: "user@example.com",
      password: "pass",
    });
  });

  it.each(["", "not-an-email", "x".repeat(255) + "@example.com"])(
    "rejects invalid or oversized email addresses: %s",
    (email) => {
      expect(loginSchema.safeParse({ email, password: "password" }).success).toBe(
        false,
      );
    },
  );

  it("requires a non-empty password up to 128 characters", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "" }).success,
    ).toBe(false);
    expect(
      loginSchema.safeParse({
        email: "user@example.com",
        password: "p".repeat(129),
      }).success,
    ).toBe(false);
  });
});

describe("registerSchema", () => {
  it("trims the name and normalizes the email", () => {
    expect(
      registerSchema.parse({
        name: "  Ada Lovelace  ",
        email: " ADA@Example.com ",
        password: "password123",
      }),
    ).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "password123",
    });
  });

  it("rejects names shorter than 2 or longer than 80 characters", () => {
    expect(
      registerSchema.safeParse({
        name: "A",
        email: "user@example.com",
        password: "password123",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        name: "A".repeat(81),
        email: "user@example.com",
        password: "password123",
      }).success,
    ).toBe(false);
  });

  it("requires passwords from 8 through 128 characters", () => {
    for (const password of ["short7", "p".repeat(129)]) {
      expect(
        registerSchema.safeParse({
          name: "Valid Name",
          email: "user@example.com",
          password,
        }).success,
      ).toBe(false);
    }

    expect(
      registerSchema.safeParse({
        name: "Valid Name",
        email: "user@example.com",
        password: "p".repeat(8),
      }).success,
    ).toBe(true);
  });
});
