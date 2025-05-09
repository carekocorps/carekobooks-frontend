"use client"

import Banner from "@/components/program/banners";
import Activity from "@/components/program/activity";
import { useBooks } from "@/hooks/useBooks";
import BookSection from "@/components/program/book-section";

export default function Home() {
  const { books, loading } = useBooks();

  return (
    <section className="flex flex-col w-350 y- mt-4 gap-15">
      <Banner image1="/distopia.png" image2="/ad.png" />

      <div className="flex gap-40">
        <div className="flex flex-col gap-4">
          <BookSection title="Popular na sua rede" iconClass="bi bi-lightbulb-fill" books={books} loading={loading} />
          <BookSection title="Continue Lendo" iconClass="bi bi-book-fill" books={books} loading={loading} />
          <BookSection title="Livros mais recentes" iconClass="bi bi-bookmarks-fill" books={books} loading={loading} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl">
          <h1 className="text-2xl text-white bg-gradient-to-r from-[#023e7d] to-[#001233] p-3 rounded-md flex items-center justify-between">
            Atividade
            <i className="bi-people-fill text-white text-xl" />
          </h1>
          <div className="flex flex-col gap-2">
            <Activity username="@benilton" livro="É Assim que Acaba" horario="12:00" imagem="/usersMock/ro.png" />
            <Activity username="@nayetdet" livro="Diário de um Banana" horario="17:00" imagem="/usersMock/jk.png" />
            <Activity username="@isaac" livro="Sapiens" horario="08:00" imagem="/usersMock/jennie.png" />
            <Activity username="@huan" livro="É assim que acaba" horario="14:30" imagem="/usersMock/rose.png" />
            <Activity username="@ryanDoBabas" livro="É Assim que Acaba" horario="12:00" imagem="/usersMock/sana.png" />
          </div>
        </div>
      </div>
    </section>
  );
}
