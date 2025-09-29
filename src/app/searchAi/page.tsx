"use client";

import AISearch from '@/components/AISearch/AISearch'
import React from 'react'

function SearchAiPage() {
  return (
    <div className='main w-full'>
      <div className='container mx-auto'>
        <header className='relative py-4'>
          <h1 className='text-[26px] mt-4 font-bold mb-3'>AI Search Input</h1>
        </header>
        <AISearch />
      </div>
    </div>
  )
}

export default SearchAiPage