import { redirect } from "next/navigation";
import Icon from "../../../components/Icons";
import AdminLoginForm from "../../../components/AdminLoginForm";
import { getSession, isAdminConfigured } from "../../../lib/adminAuth";

export const metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  const configured = isAdminConfigured();

  return (
    <section className="section">
      <div className="wrap">
        <div className="admin-login">
          <div className="clay clay-solid clay-pad">
            <span className="tile" style={{ marginBottom: "1.1rem" }}>
              <Icon name="lock" />
            </span>
            <h1 className="h-card" style={{ fontSize: "1.5rem" }}>
              Staff sign-in
            </h1>
            <p
              style={{
                color: "var(--ink-2)",
                margin: "0.4rem 0 1.6rem",
                fontSize: "0.97rem",
              }}
            >
              Bookings and enquiries from the website land on the dashboard
              behind this form.
            </p>

            {configured ? (
              <AdminLoginForm />
            ) : (
              <p className="form-alert" role="alert">
                <Icon name="alert" />
                <span>
                  Sign-in isn&apos;t set up on this server yet. Add{" "}
                  <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> to
                  the environment file and restart.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
