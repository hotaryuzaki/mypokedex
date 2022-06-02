import React from 'react';
import '../pokedex.css';
import MonsterDetail from './MonsterDetail';
import MonsterEvolution from './MonsterEvolution';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterProfile(props) {
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

  // RENDER
  return (
    <div className={`Monster ${data[0].pokemons[0].types[0].type.name}`}>
      <div className={'Profile'}>
        <div className='Item'>
          <div className='ItemBox'>
            <img
              src={`${imagePath}${data[0].id}.png`}
              className='ItemImg'
              alt='item_image'
            />

            <IdMonster id={data[0].id} />

            <div className='ItemName'>
              {data[0].name}
            </div>

            {
              data[0].pokemons[0].types.map((arr, i) => (
                <span key={i} className={`ItemType ${arr.type.name}`}>
                  {arr.type.name}
                </span>
              ))
            }
          </div>
        </div>
        
        <MonsterDetail data={data} />
      </div>

      <MonsterEvolution data={data[0].evolutions.species} />
    </div>
  );
}

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.data[0].id !== nextProps.data[0].id) {
    return false;
  }

  return true;
}

export default React.memo(MonsterProfile, areEqual);
  