import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Navbar, Toast, ToastContainer } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import axios from 'axios';
import MonsterList from '../components/MonsterList';
import '../pokedex.css';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";

function Home() {
  const [error, setError] = useState([]);
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
      setError([]);

      // INFINITE SCROLL LOADING ANIMATION
      if (data.length >= response.data.data.species_aggregate.aggregate.count)
        setLoadingMore(false);
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
        
        <MonsterList data={memoData}/>
        
        {
          loadingMore &&
            <div style={{ marginBottom: 50 }}>
              <img
                src={pokeballIcon}
                className="Loading"
                alt="logo"
              />
            </div>
        }
        
        { error.length > 0 && error }
      </div>
  );
}

export default Home;
