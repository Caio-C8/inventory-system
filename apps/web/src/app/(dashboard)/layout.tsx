import NavBar from '@/components/layout/nav-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="py-[50px] px-[60px]">{children}</main>
    </>
  );
}
