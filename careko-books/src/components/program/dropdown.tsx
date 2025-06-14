import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export default function Dropdown({ children, onLogout }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2 text-base mr-20">
        <DropdownMenuLabel className="text-gray-700 text-sm">Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <a href="/user/profile">
          <DropdownMenuItem className="flex items-center gap-2 hover:bg-zinc-100 cursor-pointer">
            <i className="bi bi-person-fill text-lg text-zinc-600" />
            Meu Perfil
          </DropdownMenuItem>
        </a>
        
        <DropdownMenuItem className="flex items-center gap-2 hover:bg-zinc-100 cursor-pointer">
          <i className="bi bi-book-half text-lg text-zinc-600" />
          Meus Livros
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-zinc-100 cursor-pointer">
          <i className="bi bi-gear-fill text-lg text-zinc-600" />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right text-lg" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}