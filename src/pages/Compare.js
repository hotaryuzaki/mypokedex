import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Container, Navbar, Toast, ToastContainer } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import axios from 'axios';
import '../pokedex.css';
import MyNavbar from '../components/MyNavbar';
import MonsterCompare from '../components/MonsterCompare';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";

function Compare() {
  let { id, id2 } = useParams();
  const [error, setError] = useState([]);
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);

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
      setError([
        <ToastContainer className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={pokeballIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">My Pokedex</strong>
            </Toast.Header>
            <Toast.Body>API Gudang Pokemon error nih!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
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
            firstPokemon: pokemon_v2_pokemonspecies(where: {name: {_eq: ${id}}}, limit: 1) {
              id
              name
              gender_rate
              hatch_counter
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
            secondPokemon: pokemon_v2_pokemonspecies(where: {name: {_eq: ${id2}}}, limit: 1) {
              id
              name
              gender_rate
              hatch_counter
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
          }
        `
      };
      const response = await axios.post(
        url,
        query,
        { headers }
      );

      setData(response.data.data);
      setError([]);
    }

    catch (e) {
      setError([
        <ToastContainer className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={pokeballIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">My Pokedex</strong>
            </Toast.Header>
            <Toast.Body>API Gudang Pokemon error nih!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }

  }, [id]);

  // RENDER
  return (
    loading
      ?
      <div className='LoadingContainer'>
        <img
          src={pokeballIcon}
          className="Loading"
          alt="logo"
        />

        { error.length > 0 && error }
      </div>

      :
      <div className='Content'>
        <MyNavbar hasBack={true} />

        <MonsterCompare data={data} />

        { error.length > 0 && error }
      </div>
  );
}

export default Compare;
  