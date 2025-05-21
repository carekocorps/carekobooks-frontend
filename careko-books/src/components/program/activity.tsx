import { Avatar} from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type ActivityProps = {
    username: string,
    livro: string,
    horario: string
    imagem: string
}

export default function Activity({username, livro, horario, imagem}: ActivityProps){
    return(
        <div className="w-100 bg-white rounded-md flex flex-col shadow-md p-6 gap-2 border-2 justify-center">


            <div className="flex gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage
                        src={imagem}
                        alt="Imagem de avatar"
                        className="object-cover w-full h-full"
                    />
                </Avatar>
                <h2 className="text-[#2E2E2E] text">
                    <strong>{username}</strong> favoritou <span className="text-[#1e3472]">{livro}</span>
                </h2>
            </div>
            
            <h2 className="text-[#727272] text-sm">hoje, às {horario}</h2>
        </div>
    )
}