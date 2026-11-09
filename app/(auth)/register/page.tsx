import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "~/components/auth/register-form";
import { auth } from "~/lib/auth";
import styles from "../auth.module.css";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/user");
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard} aria-labelledby="register-heading">
        <h1 className={styles.heading} id="register-heading">
          Create your account
        </h1>
        <p className={styles.intro}>Register with your name, email, and password.</p>
        <RegisterForm />
        <p className={styles.footer}>
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
