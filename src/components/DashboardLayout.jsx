function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

export default DashboardLayout;
