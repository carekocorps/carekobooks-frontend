"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/", icon: "bi-house" },
  { label: "Threads", href: "/auth", icon: "bi-chat-dots" },
  { label: "Seus Livros", href: "/user/profile", icon: "bi-book" },
  { label: "Administrador", href: "/adm", icon: "bi-person-gear" },
];

function NavItem({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  onClick?: () => void;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          onClick={onClick}
          className="px-4 py-2 text-sm flex items-center gap-2 hover:text-blue-300 transition-colors"
        >
          <i className={`bi ${icon} text-base`}></i>
          {label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="sm:hidden">
        <Button
          variant="ghost"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-white hover:bg-transparent"
        >
          <i className="bi bi-list text-2xl"></i>
        </Button>
      </div>

      <NavigationMenu className="hidden sm:flex">
        <NavigationMenuList className="flex gap-6 font-semibold text-white">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 bg-[#001233] text-white rounded-lg shadow-lg border border-white/10 sm:hidden z-50">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-1 p-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </div>
  );
}
