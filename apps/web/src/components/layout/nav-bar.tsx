'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { ThemeButton } from './theme-button';
import { LogoutButton } from './logout-button';

export default function NavBar() {
  const pathname = usePathname();

  const navItemStyles = (path: string) =>
    cn(
      'h-10 px-4 py-2 text-lg cursor-pointer',
      pathname.startsWith(path)
        ? 'dark:text-[#FAFAFA] underline dark:decoration-[#FAFAFA]'
        : 'hover:underline',
    );

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex">
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger className={navItemStyles('/products')}>
            <div>Produtos</div>
          </HoverCardTrigger>

          <HoverCardContent align="start" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              <Link
                href="/products"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Ver produtos
              </Link>
              <Link
                href="/products/create"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Cadastrar produtos
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger className={navItemStyles('/sales')}>
            <div>Vendas</div>
          </HoverCardTrigger>

          <HoverCardContent align="start" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              <Link
                href="/sales"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Ver vendas
              </Link>
              <Link
                href="/sales/create"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Cadastrar vendas
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger className={navItemStyles('/customers')}>
            <div>Clientes</div>
          </HoverCardTrigger>

          <HoverCardContent align="start" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              <Link
                href="/customers"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Ver clientes
              </Link>
              <Link
                href="/customers/create"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Cadastrar cliente
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger className={navItemStyles('/reports')}>
            <div>Relatórios</div>
          </HoverCardTrigger>

          <HoverCardContent align="start" className="w-56 p-2">
            <div className="flex flex-col gap-1">
              <Link
                href="/reports/sales"
                className="block px-2 py-1.5 text-sm hover:bg-accent rounded-md"
              >
                Relatório de vendas
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex items-center gap-3">
        <ThemeButton />

        <LogoutButton />
      </div>
    </nav>
  );
}
