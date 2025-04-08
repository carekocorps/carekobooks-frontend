import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from "next/image"

  export default function Banner(){
    return(
      <Carousel>
        <CarouselContent>
          <CarouselItem className="my-0 mx-auto ">
            <div className="relative w-full h-64">
              <Image
                src="/distopia.png"
                alt="Banner chamativo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative w-full h-64">
              <Image
                src="/distopia.png"
                alt="Banner chamativo"
                fill
                className="object-cover rounded-lg"
              />
          </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
    )
  }