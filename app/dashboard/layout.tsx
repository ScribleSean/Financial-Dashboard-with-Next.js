import DashboardGuard from '@/app/ui/dashboard/dashboard-guard';
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow overflow-y-auto p-6 md:p-12 md:pt-8">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardGuard>{children}</DashboardGuard>
        </div>
      </div>
    </div>
  );
}
