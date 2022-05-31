import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import '../pokedex.css';
import MonsterDetail from '../components/MonsterDetail';

const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

function Monster() {
  let { id } = useParams();
  const [data, setData] = useState(true);
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
          query getPokemon {
            species: pokemon_v2_pokemonspecies(where: {name: {_eq: ${id}}}, limit: 1) {
              id
              gender_rate
              hatch_counter
              name
              description: pokemon_v2_pokemonspeciesflavortexts(limit: 1, where: {pokemon_v2_language: {name: {_eq: "en"}}}) {
                flavor_text
              }
              evolutions: pokemon_v2_evolutionchain {
                species: pokemon_v2_pokemonspecies(order_by: {order: asc}) {
                  id
                  name
                  evolves_from_species_id
                  evolutions: pokemon_v2_pokemonevolutions {
                    min_level
                    min_affection
                    min_beauty
                    min_happiness
                    gender_id
                    time_of_day
                    move: pokemon_v2_move {
                      name
                    }
                    by_held_item: pokemonV2ItemByHeldItemId {
                      name
                    }
                    item: pokemon_v2_item {
                      name
                    }
                    evolution_trigger: pokemon_v2_evolutiontrigger {
                      name
                    }
                    location: pokemon_v2_location {
                      name
                    }
                  }
                }
              }
              egg_groups: pokemon_v2_pokemonegggroups {
                group: pokemon_v2_egggroup {
                  name
                }
              }
              pokemons: pokemon_v2_pokemons {
                id
                name
                height
                weight
                types: pokemon_v2_pokemontypes {
                  type: pokemon_v2_type {
                    name
                  }
                }
                abilities: pokemon_v2_pokemonabilities {
                  ability: pokemon_v2_ability {
                    name
                  }
                }
                stats: pokemon_v2_pokemonstats {
                  base_stat
                  stat: pokemon_v2_stat {
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
      
      setData(response.data.data.species);
      // console.log(response.data.data.species);

      // INFINITE SCROLL LOADING ANIMATION
      if (data.length >= response.data.data.species_aggregate.aggregate.count)
        setLoadingMore(false);
    }

    catch (e) {
      <Alert variant='danger'>
        Function _getMonsters error!
      </Alert>
    }

  }, [id]);

  const IdMonster = ({ id }) => {
    return (
      <div className='ItemId'>
        #{id.toString().padStart(3, '0')}
      </div>  
    )
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

          <div id="Evolution" className="Evolution">
            <label>Evolution</label>
            <p>Evolution</p>
          </div>
        </div>
      </div>
  );
}

export default Monster;
  