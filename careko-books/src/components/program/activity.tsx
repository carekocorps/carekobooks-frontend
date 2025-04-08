
type ActivityProps = {
    username: string,
    livro: string,
    horario: string
}



export default function Activity({username, livro, horario}: ActivityProps){
    return(
        <div className="w-full bg-white rounded-xl flex flex-col shadow-md p-13">
            <h2 className="text-[#2E2E2E] text-xl">hoje, às {horario}</h2>
            <h2 className="text-[#2E2E2E] text-xl">
                <strong>{username}</strong> adicionou o livro {livro} na lista de favoritos
            </h2>
            
        </div>
    )
}