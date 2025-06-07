import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

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
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link href={href} className="px-4 py-2 text-sm flex items-center gap-2">
          <i className={`bi ${icon} text-sm`}></i>
          {label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

export default function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-6 font-semibold text-white">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
