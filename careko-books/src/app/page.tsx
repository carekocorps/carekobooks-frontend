import Banner from "@/components/program/banners";
import Book from "@/components/program/book";
import Activity from "@/components/program/activity";

export default function Home() {
  return (
    <section className="flex flex-col w-350 y- mt-4 gap-15">
          <Banner/>

          <div className="flex gap-40">
            <div className="flex flex-col gap-7">
              <h1 className="text-2xl text-[#2E2E2E]">Pouplar na sua rede</h1>
            
              <div className="flex gap-6 justify-start w-full ">
                <Book image="/metamorfose.png" name="A Metamorfose"/>
                <Book image="/image.png" name="Biriba"/>
                <Book image="/larissa.png" name="O Diário de Larissa Manoela"/>
                <Book image="/rezende.png" name="Dois Mundos, Um Herói"/>
              </div>

              <h1 className="text-2xl text-[#2E2E2E]">Continue Lendo</h1>
       

                <div className="flex gap-6 justify-start w-full ">
                  <Book image="/larissa.png" name="O Diário de Larissa Manoela"/>
                </div>

              <h1 className="text-2xl text-[#2E2E2E]">Livros mais recentes</h1>

                <div className="flex gap-6 justify-start w-full ">
                  <Book image="/metamorfose.png" name="A Metamorfose"/>
                  <Book image="/image.png" name="Biriba"/>
                  <Book image="/larissa.png" name="O Diário de Larissa Manoela"/>
                  <Book image="/rezende.png" name="Dois Mundos, Um Herói"/>
                </div>
            </div>
              <div className="flex flex-col gap-5">
                  <Activity username="@Amanda" livro="É Assim que Acaba" horario="12:00"/>
                  <Activity username="@nayetdet" livro="Diário de um Banana" horario="17:00"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="08:00"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="14:30"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="12:00"/>
              </div>
          </div>
          </section>
  );
}
