"use client";

import { Wallet } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAVIGATION_LIST } from "@/constants/navigation";

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <div className="font-semibold">
                  <div className="flex items-center justify-center rounded-lg bg-emerald-500 p-2 text-white">
                    <Wallet className="size-5" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    IN<span className="text-emerald-500">EX</span>
                  </span>
                </div>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {NAVIGATION_LIST.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    render={
                      <a
                        href={item.href}
                        className={cn(
                          "h-auto px-4 py-3 hover:bg-emerald-100!",
                          {
                            "bg-emerald-500 text-white hover:bg-emerald-500! hover:text-white":
                              pathname === item.href,
                          },
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.name}</span>
                      </a>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
