import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../lib/password";

describe("password helpers", () => {
  it("creates a salted hash that verifies the original password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    const [salt, key] = hash.split(":");

    expect(salt).toMatch(/^[\da-f]{32}$/);
    expect(key).toMatch(/^[\da-f]{128}$/);
    await expect(
      verifyPassword("correct horse battery staple", hash),
    ).resolves.toBe(true);
  });

  it("uses a different salt for each hash of the same password", async () => {
    const firstHash = await hashPassword("same password");
    const secondHash = await hashPassword("same password");

    expect(firstHash).not.toBe(secondHash);
    await expect(verifyPassword("same password", secondHash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correct password");

    await expect(verifyPassword("incorrect password", hash)).resolves.toBe(false);
  });

  it.each(["", "not-a-hash", "aa:bb", `${"a".repeat(32)}:${"b".repeat(128)}:extra`])(
    "rejects a malformed stored hash: %s",
    async (storedHash) => {
      await expect(verifyPassword("any password", storedHash)).resolves.toBe(false);
    },
  );
});
