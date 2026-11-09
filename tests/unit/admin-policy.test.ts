import { describe, expect, it } from "vitest";
import { canChangeAdminStatus, canDeleteUser } from "../../lib/admin/policy";

describe("admin account protections", () => {
  it("prevents an admin from removing their own admin role", () => {
    expect(
      canChangeAdminStatus({
        actorId: "admin-1",
        targetId: "admin-1",
        targetIsAdmin: true,
        nextIsAdmin: false,
        adminCount: 2,
      }),
    ).toBe(false);
  });

  it("allows an admin to demote another admin when another admin remains", () => {
    expect(
      canChangeAdminStatus({
        actorId: "admin-1",
        targetId: "admin-2",
        targetIsAdmin: true,
        nextIsAdmin: false,
        adminCount: 2,
      }),
    ).toBe(true);
  });

  it("prevents demoting the last admin", () => {
    expect(
      canChangeAdminStatus({
        actorId: "admin-1",
        targetId: "admin-2",
        targetIsAdmin: true,
        nextIsAdmin: false,
        adminCount: 1,
      }),
    ).toBe(false);
  });

  it("prevents deleting the acting admin", () => {
    expect(canDeleteUser("admin-1", "admin-1", true, 2)).toBe(false);
  });

  it("prevents deleting the last admin and allows deletion when another remains", () => {
    expect(canDeleteUser("admin-1", "admin-2", true, 1)).toBe(false);
    expect(canDeleteUser("admin-1", "admin-2", true, 2)).toBe(true);
  });
});
