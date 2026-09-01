import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold">SIM-AMI</h1>
          <p className="text-sm text-gray-600">SPs UIKA</p>
        </div>

        <nav className="px-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/users"
            className="block px-4 py-2 rounded hover:bg-gray-100 bg-gray-50"
          >
            User Management
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST" }).then(() => {
                window.location.href = "/login";
              });
            }}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">{children}</main>
    </div>
  );
}
