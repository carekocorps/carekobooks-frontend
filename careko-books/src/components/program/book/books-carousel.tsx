"use client";

import { ReactNode, useRef, useState, useEffect } from "react";

type Props = {
    books: ReactNode[];
};

export default function CarouselBooks({ books }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll);
        return () => el.removeEventListener("scroll", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = el.clientWidth * 0.9;
        el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    return (
        <div className="relative mt-4 max-w-full">
            {/* Botão ← */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll("left")}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Scroll left"
                >
                    <i className="bi bi-chevron-left text-xl" />
                </button>
            )}

            {/* Botão → */}
            {canScrollRight && (
                <button
                    onClick={() => scroll("right")}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Scroll right"
                >
                    <i className="bi bi-chevron-right text-xl" />
                </button>
            )}

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2 max-w-full"
            >
                {books.map((book, i) => (
                    <div key={i} className="min-w-[160px] flex-shrink-0">
                        {book}
                    </div>
                ))}
            </div>
        </div>
    );
}
