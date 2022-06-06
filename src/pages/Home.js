import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { FilterContext } from '../config/ReactContext';
import MyNavbar from '../components/MyNavbar';
import MonsterList from '../components/MonsterList';
import '../pokedex.css';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";

function Home() {
  const filterContext = useContext(FilterContext);
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
  
  // GET API DATA LIST
  const _getMonsters = useCallback (async () => {
    try {
      const url = 'https://beta.pokeapi.co/graphql/v1beta';
      const headers = {
        'Content-Type': 'application/json'
      };
      
      const queryTypes =
        filterContext.filterValue[2].type.length > 0
          ?
          `pokemon_v2_pokemons: {
            pokemon_v2_pokemontypes: {
              pokemon_v2_type: {
                name: {
                  _in: [${filterContext.filterValue[2].type}]
                }
              }
            }
          }`
          : '';
          
      const queryGen =
        filterContext.filterValue[2].gen.length > 0
          ?
          `pokemon_v2_generation: {
            name: {
              _in: [${filterContext.filterValue[2].gen}]
            }
          }`
          : '';
      
      // console.log("queryTypes queryGen", queryTypes, queryGen)
      
      var queryFilter = '';
      var aggregateFilter = '';
      if (filterContext.filterValue[2].type.length > 0 && filterContext.filterValue[2].gen.length > 0) {
        queryFilter = `, where: { ${queryTypes}, ${queryGen} }`;
        aggregateFilter = `(where: { ${queryTypes}, ${queryGen} })`;
      }
      else if (filterContext.filterValue[2].type.length > 0) {
        queryFilter = `, where: { ${queryTypes} }`;
        aggregateFilter = `(where: { ${queryTypes} })`;
      }
      else if (filterContext.filterValue[2].gen.length > 0) {
        queryFilter = `, where: { ${queryGen} }`;
        aggregateFilter = `(where: { ${queryGen} })`;
      }

      // console.log('queryFilter', queryFilter);

      const query = {
        query : `
          query getPokemons {
            species: pokemon_v2_pokemonspecies(limit: ${limit}, offset: ${offset}, order_by: {id: asc} ${queryFilter}) {
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
            species_aggregate: pokemon_v2_pokemonspecies_aggregate ${aggregateFilter} {
              aggregate {
                count
              }
            }
          }
        `
      };
      
      // console.log(query);

      const response = await axios.post(
        url,
        query,
        { headers }
      );
      
      if (offset === 0) {
        setData(response.data.data.species);
        setLoading(false);
      }
      else setData([ ...data, ...response.data.data.species ]);
      
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

  }, [filterContext, offset]);

  // USEEFFECT INFINITE SCROLL
  useEffect(() => {
    console.log('USEEFFECT SCROLL', offset);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    if (!unmounted && offset > 0 && loadingMore) {
      console.log('USEEFFECT SCROLL RUN _getMonsters');
      _getMonsters();
    }

    window.addEventListener("scroll", handleScroll); // attaching scroll event listener

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [offset]);

  // USEEFFECT FILTER
  useEffect(() => {
    console.log('USEEFFECT FILTER', offset);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    if (!unmounted && filterContext.filterValue) {
      console.log('USEEFFECT FILTER RUN _getMonsters');
      _getMonsters();
    }

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [filterContext.filterValue]);

  const handleScroll = (e) => {
    let element = e.target.scrollingElement;
    console.log('handleScroll', element.scrollHeight - element.scrollTop === element.clientHeight)

    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      console.log('handleScroll RUUUUUN')
      setOffset(offset + limit);
    }
  };

  const _callbackFilter = useCallback((data) => {
    const prevProps = filterContext.filterValue[2];
    const nextProps = data[2];

    // TO IMPROVE PERFORMANCE WE CHECK PROPS MANUALLY INSIDE ARRAY
    if (
      JSON.stringify(prevProps.type) !== JSON.stringify(nextProps.type)
      ||
      JSON.stringify(prevProps.gen) !== JSON.stringify(nextProps.gen)
    ) {
      setLoading(true); // RESET PAGE LOADING
      setLoadingMore(true); // RESET PAGE LOADING MORE
      setOffset(0); // RESET PAGING
      filterContext.setFilterValue(data);
    }

  }, [filterContext.filterValue]);

  const memoData = useMemo(() => ({
    data
  }), [data]); // USEMEMO FOR DATA
  
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
        <MyNavbar hasFilter={true} callbackFilter={_callbackFilter} />
        
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
