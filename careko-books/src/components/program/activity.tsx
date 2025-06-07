import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type ActivityProps = {
    username: string,
    livro: string,
    horario: string
    imagem: string
}

export default function Activity({username, livro, horario, imagem}: ActivityProps){
    return(
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg flex flex-col shadow-sm p-4 gap-2 border border-gray-100 dark:border-gray-700">
            <div className="flex gap-4 items-center">
                <Avatar className="w-10 h-10">
                    <AvatarImage
                        src={imagem}
                        alt="Imagem de avatar"
                        className="object-cover w-full h-full rounded-full"
                    />
                </Avatar>
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                    <strong>{username}</strong> favoritou <span className="text-blue-600 dark:text-blue-400">{livro}</span>
                </p>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 text-xs">hoje, às {horario}</p>
        </div>
    )
}