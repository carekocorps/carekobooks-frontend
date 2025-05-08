'use client';

import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import React, { useState } from 'react'

export default function SearchBar(){
    const router = useRouter();
    const [query, setquery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!query.trim()) return;
        router.push(`/books?search=${encodeURIComponent(query)}`);
    };

  return (
    <form onSubmit={handleSubmit}>
        <Input 
            type="text" 
            value={query}
            onChange={(e) => setquery(e.target.value)}
            placeholder="Buscar livros..."
            className="text-white placeholder:text-white/70 bg-white/40 rounded-md "
        />
    </form>
  )
}
