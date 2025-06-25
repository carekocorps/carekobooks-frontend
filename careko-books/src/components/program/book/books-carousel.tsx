import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"


  interface CarouselBooksProps {
    books: React.ReactNode[] 
  }
  
  export default function CarouselBooks({ books }: CarouselBooksProps) {
    return (
      <Carousel>
        <CarouselContent className="ml-2 mt-2">
          {books.map((book, index) => (
            <CarouselItem key={index} className="pl-4 basis-auto">
              {book}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }
  
