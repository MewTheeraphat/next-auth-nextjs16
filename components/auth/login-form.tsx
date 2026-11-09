"use client";

import { useActionState } from "react";
import { loginAction } from "~/app/actions/auth";
import styles from "~/app/(auth)/auth.module.css";
import type { AuthFormState } from "~/lib/validation/auth";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="login-email">Email</label>
        <input
          autoComplete="email"
          id="login-email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "login-email-error" : undefined}
        />
        {state.errors?.email?.[0] && (
          <p className={styles.fieldError} id="login-email-error">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="login-password">Password</label>
        <input
          autoComplete="current-password"
          id="login-password"
          name="password"
          type="password"
          required
          aria-invalid={Boolean(state.errors?.password)}
          aria-describedby={
            state.errors?.password ? "login-password-error" : undefined
          }
        />
        {state.errors?.password?.[0] && (
          <p className={styles.fieldError} id="login-password-error">
            {state.errors.password[0]}
          </p>
        )}
      </div>
      {state.message && (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      )}
      <button className={styles.submit} disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
