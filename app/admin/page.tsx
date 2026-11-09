import Link from "next/link";
import { UserManagement } from "~/components/admin/user-management";
import styles from "./admin.module.css";
import { requireAdmin } from "~/lib/admin/authorization";
import prisma from "~/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();

  const [totalUsers, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    }),
  ]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.description}>
            Manage accounts and administrator access.
          </p>
        </div>
        <Link className={styles.homeLink} href="/">
          Back to home
        </Link>
      </header>

      <section className={styles.summary} aria-label="User summary">
        <span className={styles.summaryLabel}>Total users</span>
        <strong className={styles.summaryCount}>{totalUsers}</strong>
      </section>

      <UserManagement users={users} />
    </main>
  );
}
