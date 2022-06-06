import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import '../pokedex.css';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function MonsterList(props) {
  const {
  	data,
    showCheckbox,
    callbackCheckbox
  } = props;
  const [checkbox, setCheckbox] = useState(showCheckbox);
  const [compare, setCompare] = useState([]);

  const IdMonster = ({ id }) => {
    return (
      <div className='ItemId'>
        #{id.toString().padStart(3, '0')}
      </div>
    )
  };

  const CheckBox = useCallback (({ children, showCheckbox }) => {    
    if (!showCheckbox) return false;

    return (
      <div className='CompareCheckbox'>
        {children}
      </div>
    )

  }, [checkbox]);

  const _handleCheckbox = (item, event) => {
    let update = [...compare];

    // TO REMOVE OBJECT FILTER
    const filterChecked = (cek) => {
      return cek.name !== item.name;
    }
    
    if (event.target.checked && update.length < 2) {
      update.push({ id: item.id, name: item.name });
      setCompare(update);
      callbackCheckbox(update);
    }
    else {
      const filterParams = compare.filter(filterChecked);
      setCompare(filterParams);
      callbackCheckbox(filterParams);
    }
  };
  
  const filterByName = (items, valueItem, keyItem) => {
    let findIndex;
    if (items.length > 0) {
      findIndex = items.findIndex((item) => item[keyItem] === valueItem);
    }

    return findIndex;
  };
  
  return (
    data &&
      data.data.map((item, index) => (
        <a href={`/mypokedex/${item.name}`} key={index}>
          <div className='Item'>
            <div className='ItemBox'>
              <CheckBox showCheckbox={showCheckbox} className='CompareCheckbox'>
                <Form.Check
                  type='checkbox'
                  id={`checkbox-${item.id}`}
                  disabled={compare.length >= 2 && filterByName(compare, item.name, 'name') === -1 ? true : false}
                  onChange={(event) => _handleCheckbox(item, event)}
                />
              </CheckBox>

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
  else if (prevProps.showCheckbox !== nextProps.showCheckbox) return false;

  return true;
}

export default React.memo(MonsterList, areEqual);
