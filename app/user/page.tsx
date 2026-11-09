import { redirect } from "next/navigation";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { auth } from "~/lib/auth";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="account-page">
      <section className="account-card" aria-labelledby="account-heading">
        <p className="account-eyebrow">Your account</p>
        <h1 id="account-heading">Welcome, {session.user.name ?? "User"}</h1>
        <dl className="account-details">
          <div>
            <dt>Name</dt>
            <dd>{session.user.name ?? "Not provided"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{session.user.email ?? "Not provided"}</dd>
          </div>
        </dl>
        <SignOutButton />
      </section>
    </main>
  );
}
