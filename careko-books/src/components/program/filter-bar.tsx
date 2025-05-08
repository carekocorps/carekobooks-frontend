import React from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ComboboxDemo } from './combobox'

export default function FilterBar(){
  return (
    <div className='bg-[#ECECEC] h-max w-70 flex flex-col 
    rounded-md border-md p-10 items-center justify-center
    gap-10 border-2 shadow-md'>
      <h2 className='tex-black'>
        Filtro de Busca Avançada
      </h2>

      <Separator orientation="horizontal" className="h-px bg-gray-300" />

      <div className='flex flex-col gap-2'>
        <h2>
          Autor
        </h2>
      <Input 
        type="text" 
        placeholder="Franz Kafka..."
        className="text-black placeholder:text-black/70 bg-white/40 rounded-md "
       />
      </div>

      <div className='flex flex-col gap-2'>
        <h2>
          Data de Publicação
        </h2>
      <Input 
        type="text" 
        placeholder="1987..."
        className="text-black placeholder:text-black/70 bg-white/40 rounded-md "
       />
      </div>

      <div className='flex flex-col gap-2'>
        <h2>
          Total de Páginas
        </h2>
        <div className='bg-white rounded-md w-50 p-6'>
           <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">menor que 100</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100" id="r2" />
              <Label htmlFor="r2">entre 100 e 200</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="200" id="r3" />
              <Label htmlFor="r3">entre 200 e 300</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="300" id="r4" />
              <Label htmlFor="r3">entre 300 e 400</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="400" id="r5" />
              <Label htmlFor="r3">entre 400 e 500</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="500" id="r" />
              <Label htmlFor="r3">maior que 500</Label>
            </div>
        </RadioGroup>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <h2>
          Gênero
        </h2>
        <ComboboxDemo />

      </div>

    </div>
  )
}
