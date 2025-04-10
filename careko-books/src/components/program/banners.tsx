import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from "next/image"

type BannerProps = {
  image1: string
  image2: string
}

  export default function Banner({image1, image2}:BannerProps){
    return(
      <Carousel>
        <CarouselContent>
          <CarouselItem className="my-0 mx-auto ">
            <div className="relative w-full h-64">
              <Image
                src={image1}
                alt="Banner chamativo"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative w-full h-64">
              <Image
                src={image2}
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