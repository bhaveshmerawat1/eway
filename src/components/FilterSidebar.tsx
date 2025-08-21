'use client';
import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { FaAngleUp } from 'react-icons/fa';

interface FilterSectionProps {
  title: string;
  options: string[];
}

function FilterSection({ title, options }: FilterSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-t py-3 border-gray-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full text-left font-medium text-md font-sans"
      >
        {title}
        <span className='hover:underline-none'>{open ? <FaAngleUp /> : <FaAngleDown />}</span>
      </button>

      {open && (
        <ul className="mt-2 space-y-1 transorm">
          {options.map((opt, idx) => (
            <li key={idx}>
              <label className="flex items-center gap-2 text-md font-sans cursor-pointer">
                <input type="checkbox" className="accent-red-400 w-4 h-4 cursor-pointer hover:transition-all hover:scale-130" />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <div className="bg-white">
      <FilterSection
        title="Category"
        options={['Tissue', 'Towel', 'Garbage Bags']}
      />
      <FilterSection
        title="Brand"
        options={['Kleenex', 'Cascades Pro', 'Scott']}
      />
      <FilterSection
        title="Shop Canadian"
        options={['Yes', 'No']}
      />
      <FilterSection
        title="Colour Family"
        options={['White', 'Blue']}
      />
      <FilterSection
        title="FSC-Certified"
        options={['Yes', 'No']}
      />
      <FilterSection
        title="Apparel Colour"
        options={['Black', 'White', 'Blue']}
      />
      <FilterSection
        title="Apparel Size"
        options={['Small', 'Medium', 'Large']}
      />
    </div>
  );
}
