import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Container, Navbar, Toast, ToastContainer } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import axios from 'axios';
import '../pokedex.css';
import MonsterProfile from '../components/MonsterProfile';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";

function Monster() {
  let { id } = useParams();
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
      setError([]);
      // console.log(response.data.data.species);
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
        <Navbar bg="light" sticky="top">
          <Container className='NavbarContainer'>
            <span className='NavbarLeft'>
              <a href="/mypokedex/">
                <FaArrowLeft className='NavbarBack' />
              </a>

              <header className="App-header">
                <img src='https://www.freepnglogos.com/uploads/pokemon-logo-text-png-7.png' className="App-logo" alt="logo" />
              </header>
            </span>
            
            <span className='NavbarRight'>
              <Button variant="light" size="sm" href='#compare' className='NavbarCompare' >
                Compare
              </Button>

              <a href="#filter">
                <FaFilter className='NavbarFilter' />
              </a>
            </span>
          </Container>
        </Navbar>

        <MonsterProfile data={data} />

        { error.length > 0 && error }
      </div>
  );
}

export default Monster;
  