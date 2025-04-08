import Image from "next/image";

type BookProps = {
    image: string;
    name: string;
  };

export default function Book({ image, name}: BookProps){
    return(
        <div className="flex flex-col items-center justify-center gap-2 w-40">
            <div className="relative w-40 h-60 border-5 border-white shadow-md
            transition-transform duration-300 hover:scale-105">
                <Image
                    src={image}
                    alt='Capa de Livro'
                    fill
                    className="object-cover"
                />
            </div>
            <h2 className="text-center text-sm w-full line-clamp-2 h-10">
                {name}
            </h2>
        </div>
    )
}