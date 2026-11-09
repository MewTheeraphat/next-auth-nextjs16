"use client";

import { useActionState, useState } from "react";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "~/app/actions/admin";
import type { AdminFormState } from "~/lib/validation/admin";
import styles from "./user-management.module.css";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

const emptyState: AdminFormState = {};

export function UserManagement({ users }: { users: ManagedUser[] }) {
  const [createState, createAction, isCreating] = useActionState(
    createUserAction,
    emptyState,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section className={styles.management} aria-labelledby="management-heading">
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle} id="management-heading">
            User accounts
          </h2>
          <p className={styles.sectionDescription}>
            Update account details, roles, or remove accounts.
          </p>
        </div>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => setShowCreateForm((shown) => !shown)}
          aria-expanded={showCreateForm}
          aria-controls="create-user-form"
        >
          {showCreateForm ? "Cancel" : "Add user"}
        </button>
      </div>

      {showCreateForm && (
        <form action={createAction} className={styles.createForm} id="create-user-form">
          <h3 className={styles.formTitle}>Create a user</h3>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Name</span>
              <input autoComplete="name" maxLength={80} name="name" required />
              <FieldError message={createState.errors?.name?.[0]} />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input
                autoComplete="email"
                maxLength={254}
                name="email"
                type="email"
                required
              />
              <FieldError message={createState.errors?.email?.[0]} />
            </label>
            <label className={styles.field}>
              <span>Temporary password</span>
              <input
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                name="password"
                type="password"
                required
              />
              <FieldError message={createState.errors?.password?.[0]} />
            </label>
          </div>
          <label className={styles.checkboxField}>
            <input name="isAdmin" type="checkbox" />
            <span>Grant administrator access</span>
          </label>
          {createState.message && (
            <p className={styles.status} role="status">
              {createState.message}
            </p>
          )}
          <button className={styles.primaryButton} disabled={isCreating} type="submit">
            {isCreating ? "Creating..." : "Create user"}
          </button>
        </form>
      )}

      <div className={styles.tableScroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Email</th>
              <th scope="col">Access</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
            {users.length === 0 && (
              <tr>
                <td className={styles.emptyState} colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UserRow({ user }: { user: ManagedUser }) {
  const [updateState, updateAction, isUpdating] = useActionState(
    updateUserAction.bind(null, user.id),
    emptyState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteUserAction.bind(null, user.id),
    emptyState,
  );

  return (
    <tr>
      <td>
        <form action={updateAction} id={`update-${user.id}`}>
          <label className={styles.visuallyHidden} htmlFor={`name-${user.id}`}>
            Name for {user.email}
          </label>
          <input
            className={styles.tableInput}
            defaultValue={user.name}
            id={`name-${user.id}`}
            maxLength={80}
            name="name"
            required
          />
        </form>
        <FieldError message={updateState.errors?.name?.[0]} />
      </td>
      <td>
        <label className={styles.visuallyHidden} htmlFor={`email-${user.id}`}>
          Email for {user.name}
        </label>
        <input
          className={styles.tableInput}
          defaultValue={user.email}
          form={`update-${user.id}`}
          id={`email-${user.id}`}
          maxLength={254}
          name="email"
          type="email"
          required
        />
        <FieldError message={updateState.errors?.email?.[0]} />
      </td>
      <td>
        <label className={styles.checkboxField}>
          <input
            defaultChecked={user.isAdmin}
            form={`update-${user.id}`}
            name="isAdmin"
            type="checkbox"
          />
          <span>{user.isAdmin ? "Admin" : "User"}</span>
        </label>
      </td>
      <td>
        <div className={styles.rowActions}>
          <button
            className={styles.secondaryButton}
            disabled={isUpdating}
            form={`update-${user.id}`}
            type="submit"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(`Delete the account for ${user.email}?`)) {
              event.preventDefault();
            }
          }}
        >
          <button
            className={styles.dangerButton}
            disabled={isDeleting}
            type="submit"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          {deleteState.message && (
            <p className={styles.status} role="status">
              {deleteState.message}
            </p>
          )}
        </form>
        {updateState.message && (
          <p className={styles.status} role="status">
            {updateState.message}
          </p>
        )}
      </td>
    </tr>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <span className={styles.fieldError} role="alert">
      {message}
    </span>
  );
}
