"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const adminItems = [
  { label: "Gêneros", href: "/adm/genres", icon: "bi-tags" },
  { label: "Livros", href: "/adm/books", icon: "bi-book" },
];

export function AdminDropdown({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();

  return (
    <Select onValueChange={(value) => router.push(value)}>
      <SelectTrigger 
        className={`${isMobile ? 'w-full' : 'w-[180px]'} bg-transparent text-white border-none hover:bg-white/10 focus:ring-0 focus:ring-offset-0`}
      >
        <div className="flex items-center gap-2">
          <i className="bi bi-person-gear text-base"></i>
          <SelectValue placeholder="Administrador" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#001233] text-white border-white/10">
        {adminItems.map((item) => (
          <SelectItem 
            key={item.href} 
            value={item.href}
            className="hover:bg-white/10 focus:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <i className={`bi ${item.icon} text-base`}></i>
              {item.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}