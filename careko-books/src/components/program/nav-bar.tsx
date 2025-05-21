import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function NavBar(){
    return(
    <NavigationMenu>
      <NavigationMenuList className="flex gap-6 font-semibold text-white ">
        <NavigationMenuItem>
          <Link href="/" passHref>
            <NavigationMenuLink className="px-4 py-2 text-l">
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/dashboard" passHref>
            <NavigationMenuLink className="px-4 py-2 text-l">
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/user/profile" passHref>
            <NavigationMenuLink className="px-4 py-2 text-l">
              Seus Livros
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    );
}