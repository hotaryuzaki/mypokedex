import React, { useRef, useState } from 'react';
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterList(props) {
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
        <a href={`/mypokedex/${item.name}`} key={index}>
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

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.data.data.length !== nextProps.data.data.length) return false;
  else if (JSON.stringify(prevProps.data.data) !== JSON.stringify(nextProps.data.data)) return false;

  return true;
}

export default React.memo(MonsterList, areEqual);
