"use client";

import { useActionState } from "react";
import { registerAction } from "~/app/actions/auth";
import styles from "~/app/(auth)/auth.module.css";
import type { AuthFormState } from "~/lib/validation/auth";

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="register-name">Name</label>
        <input
          autoComplete="name"
          id="register-name"
          maxLength={80}
          name="name"
          required
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={
            state.errors?.name ? "register-name-error" : undefined
          }
        />
        {state.errors?.name?.[0] && (
          <p className={styles.fieldError} id="register-name-error">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="register-email">Email</label>
        <input
          autoComplete="email"
          id="register-email"
          maxLength={254}
          name="email"
          type="email"
          required
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={
            state.errors?.email ? "register-email-error" : undefined
          }
        />
        {state.errors?.email?.[0] && (
          <p className={styles.fieldError} id="register-email-error">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          id="register-password"
          minLength={8}
          name="password"
          type="password"
          required
          aria-invalid={Boolean(state.errors?.password)}
          aria-describedby={
            state.errors?.password
              ? "register-password-error"
              : "register-password-help"
          }
        />
        <p className={styles.fieldError} id="register-password-help">
          Use at least 8 characters.
        </p>
        {state.errors?.password?.[0] && (
          <p className={styles.fieldError} id="register-password-error">
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
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
