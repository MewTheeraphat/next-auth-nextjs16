import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "~/components/auth/login-form";
import { auth } from "~/lib/auth";
import styles from "../auth.module.css";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/user");
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard} aria-labelledby="login-heading">
        <h1 className={styles.heading} id="login-heading">
          Welcome back
        </h1>
        <p className={styles.intro}>Sign in to continue to your account.</p>
        <LoginForm />
        <p className={styles.footer}>
          New here? <Link href="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
