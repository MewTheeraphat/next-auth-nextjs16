type AdminChange = {
  actorId: string;
  targetId: string;
  targetIsAdmin: boolean;
  nextIsAdmin: boolean;
  adminCount: number;
};

export function canChangeAdminStatus({
  actorId,
  targetId,
  targetIsAdmin,
  nextIsAdmin,
  adminCount,
}: AdminChange): boolean {
  if (actorId === targetId && targetIsAdmin && !nextIsAdmin) {
    return false;
  }

  if (targetIsAdmin && !nextIsAdmin && adminCount <= 1) {
    return false;
  }

  return true;
}

export function canDeleteUser(
  actorId: string,
  targetId: string,
  targetIsAdmin: boolean,
  adminCount: number,
): boolean {
  if (actorId === targetId) {
    return false;
  }

  if (targetIsAdmin && adminCount <= 1) {
    return false;
  }

  return true;
}
