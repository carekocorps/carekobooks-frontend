import Activity from "@/components/program/activity";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


export default function ViewUserProfile(){
    return (
        <main>
            <div className="flex gap-12 mt-25">
                <div className="bg-white shadow-xl w-180 h-100 rounded-2xl relative overflow-visible flex flex-col justify-center items-start gap-5 pt-20">
                    <div className="absolute -top-10 left-[20%] transform -translate-x-1/2">
                        <Avatar className="w-40 h-40 border-6 border-white shadow-md">
                            <AvatarImage
                                src="/image.png"
                                alt="Imagem de avatar"
                                className="object-cover w-full h-full"
                            />
                        </Avatar>
                    </div>

                    <div className="flex flex-col m-15 gap-5">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-start text-center">
                                <h1 className="text-3xl">Jennifer Rubi</h1>
                                <h2>@jennieisruby</h2>
                            </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between w-full px-4">
                                <h1 className="text-sm">10 seguidores</h1>
                                <h1 className="text-sm">10 seguindo</h1>
                                <h1 className="text-sm">3 livros</h1>
                            </div>

                            <div className="flex gap-4 px-4 justify-between">
                                <Button variant="outline">Configurações</Button>
                                <Button variant="outline">Editar Perfil</Button>
                            </div>
                        </div>
                    </div>

                        <div className="w-150 h-30 bg-gray-200 rounded-2xl">
                            <p className="m-10">testando testando testando testando testando testando testando testando</p>
                        </div>
                    </div>
                    
                
            </div>

                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 shadow-xl w-180 h-100 rounded-2xl 
                flex flex-col justify-center items-center">
                    <h1 className="text-white text-3xl m-7">
                        Mural de Atividades
                    </h1>

                    <Activity username="@benilton" livro="É Assim que Acaba" horario="12:00" imagem="/usersMock/ro.png" />
                </div>
            </div>
        </main>
    );
}