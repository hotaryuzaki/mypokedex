import React, { useRef, useState } from 'react';
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function Result(props) {
  const {
  	data,
  } = props;

  const IdMonster = ({ id }) => {
    return (
      <div className='ItemId'>
        #{id.toString().padStart(3, '0')}
      </div>  
    )
  }

  return (
    data &&
      data.data.map((item, index) => (
        <a href={item.name} key={index}>
          <div className='Item'>
            <div className='ItemBox'>
              <img
                src={`${imagePath}${item.id}.png`}
                className='ItemImg'
                alt='item_image'
              />

              <IdMonster id={item.id} />

              <div className='ItemName'>
                {item.name}
              </div>

              {
                item.pokemons[0].types.map((arr, i) => (
                  <span key={`${index}-${i}`} className={`ItemType ${arr.type.name}`}>
                    {arr.type.name}
                  </span>
                ))
              }
            </div>
          </div>
        </a>
      ))
  );
}

export default Result;
