import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-shell">
      <main className="home-main">
        <div className="home-content">
          <h1 className="home-title">
            A simple place for your account.
          </h1>
          <p className="home-description">
            Register or sign in to view your account details.
          </p>
        </div>
        <div className="home-actions">
          <Link
            className="action-link action-link-primary"
            href="/register"
          >
            Create account
          </Link>
          <Link className="action-link action-link-secondary" href="/login">
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
