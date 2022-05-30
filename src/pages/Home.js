import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import MonsterList from '../components/MonsterList';
import '../pokedex.css';

function Home() {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  const _getApi = async () => {
    try {
      await _getMonsters();
      setLoading(false);
    }

    catch (e) {
      <Alert variant='danger'>
        Function _getApi error!
      </Alert>
    }
  };

  const _getMonsters = useCallback (async () => {
    try {
      const url = 'https://beta.pokeapi.co/graphql/v1beta';
      const headers = {
        'Content-Type': 'application/json'
      };
      const query = {
        query : `
          query getPokemons {
            species: pokemon_v2_pokemonspecies(limit: ${limit}, offset: ${offset}, order_by: {id: asc}) {
              id
              name
              pokemons: pokemon_v2_pokemons {
                id
                types: pokemon_v2_pokemontypes {
                  type: pokemon_v2_type {
                    name
                  }
                }
              }
            }
            species_aggregate: pokemon_v2_pokemonspecies_aggregate {
              aggregate {
                count
              }
            }
          }
        `
      };
      const response = await axios.post(
        url,
        query,
        { headers }
      );
      
      setData([ ...data, ...response.data.data.species ]);

      // INFINITE SCROLL LOADING ANIMATION
      if (data.length >= response.data.data.species_aggregate.aggregate.count)
        setLoadingMore(false);
    }

    catch (e) {
      <Alert variant='danger'>
        Function _getMonsters error!
      </Alert>
    }

  }, [offset]);

  const memoData = useMemo(() => ({
    data
  }), [data]); // USEMEMO FOR DATA

  useEffect(() => {
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    if (!unmounted && loadingMore) {
      _getMonsters();
    }

    window.addEventListener("scroll", handleScroll); // attaching scroll event listener

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [offset]);

  const handleScroll = (e) => {
    let element = e.target.scrollingElement;
    // console.log(element.scrollHeight - element.scrollTop === element.clientHeight)

    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      setOffset(offset + limit);
    }
  }

  // RENDER
  return (
    loading
      ?
      <div>
        <img
          src={'pokeball-icon.svg'}
          className="Loading"
          alt="logo"
        />
      </div>

      :
      <div className='Content'>
        <MonsterList data={memoData}/>
        
        {
          loadingMore &&
            <div>
              <img
                src={'pokeball-icon.svg'}
                className="Loading"
                alt="logo"
              />
            </div>
        }
      </div>
  );
}

export default Home;
