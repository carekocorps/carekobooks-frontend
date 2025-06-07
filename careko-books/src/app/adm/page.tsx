import { Button } from "@/components/ui/button";

export default function AdmOptions(){
    return(
        <div className="p-50 flex justify-between w-200">
            <a href="/adm/books">
                <Button variant="outline">Livros</Button>
            </a>

            <a href="/adm/genres">
                <Button variant="outline">Gêneros</Button>
            </a>            
        </div>
    );
}