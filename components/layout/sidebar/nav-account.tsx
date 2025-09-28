'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { accountItems } from '@/mock-data/side-bar-nav';
import { LogOut } from 'lucide-react';
import api from '@/lib/api';

export function NavAccount() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('auth/logout', {});
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenu>
        {accountItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon className="size-4" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout}>
            <LogOut className="size-4" />
            <span>Log Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
