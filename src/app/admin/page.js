import { redirect } from "next/navigation";
import AdminDashboard from "../../components/AdminDashboard";
import { getSession } from "../../lib/adminAuth";
import { BOOKINGS, ENQUIRIES, isDbConfigured, listDocs } from "../../lib/db";

export const metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // The check lives here, next to the data it protects, rather than in a
  // layout — layouts don't re-render on every navigation.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [bookings, enquiries] = await Promise.all([
    listDocs(BOOKINGS),
    listDocs(ENQUIRIES),
  ]);

  return (
    <AdminDashboard
      adminEmail={session.email}
      bookings={bookings}
      enquiries={enquiries}
      dbReady={isDbConfigured()}
    />
  );
}
