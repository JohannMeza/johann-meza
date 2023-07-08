import { useRouter } from 'next/router';
import React from 'react';

export default function CardComponent ({ title = "Nuevo", children = null, style, zIndex = 1, isInactiveTitle = false }) {
  const {query} = useRouter();

  return (
    <div style={{ position: "relative", zIndex, ...style }} >
      <div className='flex justify-between items-center bg-primary px-4 py-2 rounded-[5px]'>
        <span className='text-white text-title-3 font-semibold font-Poppins'>{query.id ? isInactiveTitle ? title : "Editar" : title}</span>
        {children && children[0]}
      </div>

      <div className='mt-1 p-4 bg-white boxshadow-card w-full'>
        {children && children[1]}
      </div>
    </div>
  )
}