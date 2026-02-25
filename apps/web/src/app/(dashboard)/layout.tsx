import NavBar from '@/components/layout/nav-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 h-full">
      <NavBar />
      <main className="py-[50px] px-[60px] flex flex-col flex-1">
        {children}
      </main>
    </div>
  );
}
