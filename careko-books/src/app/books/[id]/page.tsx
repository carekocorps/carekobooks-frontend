'use client';


import { Button } from "@/components/ui/button";
import { Star, Check, Heart, Pen } from "lucide-react";
import Image from "next/image";


export default function BookDetailPage() {
    const book = {
        title: "A Metamorfose",
        author: "Franz Kafka",
        coverUrl: "/booksMock/metamorfose.png",
        pages: 97,
        releaseYear: 1915,
        rating: 4.7,
        totalReviews: 737,
        description: `A Metamorfose, de Franz Kafka, narra a perturbadora transformação de Gregor Samsa, um caixeiro-viajante que acorda metamorfoseado em um imenso inseto monstruoso. Incapaz de comunicar-se e rejeitado por sua família, Gregor enfrenta o isolamento, o repúdio e a desesperança daqueles a quem sempre dedicou sua vida. A obra explora temas profundos como a perda de identidade, a fragilidade das relações humanas e a alienação dentro de uma sociedade que valoriza o indivíduo apenas enquanto útil.`,
    };


    return (
        <main className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row gap-10 transition-all">


                {/* Capa do livro */}
                <div className="flex-shrink-0 mx-auto lg:mx-0 transition-transform hover:scale-105">
                    <Image
                        src={book.coverUrl}
                        alt={`Capa do livro ${book.title}`}
                        width={240}
                        height={360}
                        className="rounded-lg shadow-lg"
                    />
                </div>


                {/* Informações do livro */}
                <section className="flex-1 space-y-6 lg:max-w-2xl">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
                        <h2 className="text-lg text-gray-600 mt-1 font-serif">{book.author}</h2>
                    </div>


                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                        <span className="px-3 py-1 bg-gray-100 rounded-full">{book.pages} Páginas</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full">Data de Lançamento: {book.releaseYear}</span>
                    </div>


                    <p className="text-gray-700 text-justify leading-loose">{book.description}</p>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <Button
                            className="bg-gray-600 text-white min-w-[110px] hover:bg-gray-700 hover:scale-105 transition-all"
                        >
                            Quero Ler
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white min-w-[110px] flex gap-1 items-center hover:scale-105 transition-all">
                            <Check className="w-4 h-4" />
                            Já Li
                        </Button>
                        <Button variant="destructive" className="min-w-[110px] flex gap-1 items-center hover:scale-105 transition-all">
                            <Heart className="w-4 h-4" />
                            Favoritar
                        </Button>
                    </div>
                </section>


                {/* Avaliação */}
                <aside className="bg-gray-100 w-full lg:w-80 p-6 rounded-2xl flex flex-col items-center text-center shadow-inner transition-all">
                    <h3 className="text-5xl font-bold text-blue-900">{book.rating.toFixed(1)}</h3>
                    <div className="flex gap-1 py-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-6 h-6 ${
                                    i < Math.round(book.rating)
                                        ? "fill-blue-600 text-blue-600"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Média com base em {book.totalReviews} avaliações</p>
                    <Button variant="outline" className="w-full flex gap-2 items-center justify-center hover:scale-105 transition-all">
                        <Pen className="w-4 h-4" />
                        Avaliar
                    </Button>
                </aside>
            </div>
        </main>
    );
}



