import React from 'react';
import '../pokedex.css';
import MonsterCompareStats from './MonsterCompareStats';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterCompare(props) {
  const {
  	data,
  } = props;
  const pokemon1 = data.firstPokemon[0];
  const pokemon2 = data.secondPokemon[0];

  const IdMonster = ({ id }) => {
    return (
      <div className='ItemId'>
        #{id.toString().padStart(3, '0')}
      </div>  
    )
  }

  // RENDER
  return (
    <>
      <div>
        <div className='Item'>
          <div className='ItemBox bg-transparent'>
            <img
              src={`${imagePath}${pokemon1.id}.png`}
              className='ItemImg'
              alt='item_image'
            />

            <IdMonster id={pokemon1.id} />

            <div className='ItemName'>
              {pokemon1.name}
            </div>

            {
              pokemon1.pokemons[0].types.map((arr, i) => (
                <span key={i} className={`ItemType ${arr.type.name}`}>
                  {arr.type.name}
                </span>
              ))
            }
          </div>
        </div>

        <div className='Item'>
          <div className='ItemBox bg-transparent'>
            <img
              src={`${imagePath}${pokemon2.id}.png`}
              className='ItemImg'
              alt='item_image'
            />

            <IdMonster id={pokemon2.id} />

            <div className='ItemName'>
              {pokemon2.name}
            </div>

            {
              pokemon2.pokemons[0].types.map((arr, i) => (
                <span key={i} className={`ItemType ${arr.type.name}`}>
                  {arr.type.name}
                </span>
              ))
            }
          </div>
        </div>
      </div>

      <div className='CompareData'>
        <MonsterCompareStats data={pokemon1} position='left' />
        <MonsterCompareStats data={pokemon2} position='right' />
      </div>
    </>
  );
}

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.data !== nextProps.data) {
    return false;
  }

  return true;
}

export default React.memo(MonsterCompare, areEqual);
  