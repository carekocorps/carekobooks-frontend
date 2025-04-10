import Banner from "@/components/program/banners";
import Book from "@/components/program/book";
import Activity from "@/components/program/activity";
import { Separator } from "@/components/ui/separator";
import CarouselBooks from "@/components/program/books-carousel";

export default function Home() {
  return (
      <section className="flex flex-col w-350 y- mt-4 gap-15">
      <Banner image1="/distopia.png" image2="/ad.png" />

      <div className="flex gap-40">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-[#2E2E2E] flex items-center gap-4">
            <i className="bi bi-lightbulb-fill"></i>
            Popular na sua rede
          </h1>
          <Separator orientation="horizontal" className="h-px bg-gray-300" />

          <div className="w-218">
            <CarouselBooks
              books={[
                <Book key="1" image="/metamorfose.png" name="A Metamorfose" />,
                <Book key="2" image="/image.png" name="Biriba" />,
                <Book key="3" image="/larissa.png" name="O Diário de Larissa Manoela" />,
                <Book key="4" image="/rezende.png" name="Dois Mundos, Um Herói" />,
                <Book key="5" image="/assim.png" name="É Assim que Acaba" />,
                <Book key="6" image="/sapiens.png" name="Sapiens" />,
              ]}
            />
          </div>

          <h1 className="text-2xl text-[#2b1919] flex items-center gap-4">
            <i className="bi bi-book-fill"></i>
            Continue Lendo
          </h1>
          <Separator orientation="horizontal" className="h-px bg-gray-300" />

          <div className="w-218">
          <CarouselBooks
            books={[
              <Book key="11" image="/larissa.png" name="O Diário de Larissa Manoela" />,
            ]}
          />
          </div>

          <h1 className="text-2xl text-[#2E2E2E] flex items-center gap-4">
            <i className="bi bi-bookmarks-fill"></i>
            Livros mais recentes
          </h1>
          <Separator orientation="horizontal" className="h-px bg-gray-300" />

          <div className="w-218">
          <CarouselBooks
            books={[
              <Book key="7" image="/metamorfose.png" name="A Metamorfose" />,
              <Book key="8" image="/image.png" name="Biriba" />,
              <Book key="9" image="/larissa.png" name="O Diário de Larissa Manoela" />,
              <Book key="10" image="/rezende.png" name="Dois Mundos, Um Herói" />,
            ]}
          />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-3 rounded-xl">
            <h1 className="text-2xl text-white bg-[#0f2027] p-3 rounded-xl flex items-center justify-between">
              Atividade
              <i className="bi-people-fill text-white text-xl" />
              </h1>
            <Separator orientation="horizontal" className="h-px bg-gray-300"/>
              <div className="flex flex-col gap-5">
                  <Activity username="@Amanda" livro="É Assim que Acaba" horario="12:00"/>
                  <Activity username="@nayetdet" livro="Diário de um Banana" horario="17:00"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="08:00"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="14:30"/>
                  <Activity username="@Amanda" livro="É assim que acaba" horario="12:00"/>
              </div>
            </div>
      </div>
    </section>
  );
}
