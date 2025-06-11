import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type ActivityProps = {
    username: string;
    livro: string;
    horario: string;
    imagem: string;
    acao: "leu" | "favoritou";
};

export default function Activity({ username, livro, horario, imagem, acao }: ActivityProps) {
    const mensagem =
        acao === "leu"
            ? `leu o livro`
            : `favoritou o livro`;

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl flex flex-col shadow-md p-4 gap-2 border border-gray-100 dark:border-gray-700">
            <div className="flex gap-4 items-center">
                <Avatar className="w-10 h-10">
                    <AvatarImage
                        src={imagem}
                        alt={`Avatar de ${username}`}
                        className="object-cover w-full h-full rounded-full"
                    />
                </Avatar>
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                    <strong>{username}</strong> {mensagem} <span className="text-blue-600 dark:text-blue-400">{livro}</span>
                </p>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">hoje, às {horario}</p>
        </div>
    );
}
