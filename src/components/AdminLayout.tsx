import { ReactNode } from 'react';
import Header from '@/components/Header';
import AdminSidebar from '@/components/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <main className="flex-1">
            <div className="border-b p-4">
              <SidebarTrigger />
            </div>
            <div className="p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>

              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
