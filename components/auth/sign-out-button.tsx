import { logoutAction } from "~/app/actions/auth";
import styles from "./sign-out-button.module.css";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button className={styles.button} type="submit">
        Sign out
      </button>
    </form>
  );
}
