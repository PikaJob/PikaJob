import React from 'react';

function Title(): JSX.Element {
  return (
    <div className='flex justify-center space-x-2 items-center bg-aquamarine/50 p-10 '>
      <div className='w-1/12'>
        <img src='https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png' alt='' />
      </div>
      <h1 className='text-8xl font-pikachu tracking-widest font-bold'>
        <span className=' text-yellow-500'>P I K</span>
        <span className=' text-red-600 font-game text-9xl'> A</span>
        <span className=' text-yellow-500'> J O B</span>
      </h1>
    </div>
  );
}

export default Title;
