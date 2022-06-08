import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import { FilterContext } from '../config/ReactContext';
import MyNavbar from '../components/MyNavbar';
import MonsterList from '../components/MonsterList';
import '../pokedex.css';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";
const imagePath = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';


function Home() {
  const filterContext = useContext(FilterContext);
  const [error, setError] = useState([]);
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(40);
  const [offset, setOffset] = useState(0);
  const [compare, setCompare] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
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
    // console.log('USEEFFECT SCROLL', offset);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    if (!unmounted && offset > 0 && loadingMore) {
      // console.log('USEEFFECT SCROLL RUN _getMonsters');
      _getMonsters();
    }

    window.addEventListener("scroll", handleScroll); // attaching scroll event listener

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [offset]);

  // USEEFFECT FILTER
  useEffect(() => {
    // console.log('USEEFFECT FILTER', offset);
    let unmounted = false; // FLAG TO CHECK COMPONENT UNMOUNT

    if (!unmounted && filterContext.filterValue) {
      // console.log('USEEFFECT FILTER RUN _getMonsters');
      _getMonsters();
    }

    // CLEAR FUNCTION COMPONENT UNMOUNT
    return () => unmounted = true;

  }, [filterContext.filterValue]);

  const handleScroll = (e) => {
    let element = e.target.scrollingElement;

    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 70) {
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
      filterContext.setFilterValue(data); // UPDATE GLOBAL STATE
    }

  }, [filterContext.filterValue]);

  const _callbackShowCheckbox = useCallback((data) => {    
    // console.log('Home _callbackShowCheckbox HAHAHA', data)
    setShowCheckbox(data);
  }, [showCheckbox]);

  const _callbackCheckbox = useCallback((data) => {
    // console.log('Home _callbackCheckbox hahaha', data)
    setCompare(data);
    if (data.length > 0) setShowCompare(true);
    else setShowCompare(false);
  }, [compare]);

  const memoData = useMemo(() => ({
    data
  }), [data]); // USEMEMO FOR DATA

  const CompareModal = useCallback (({ data, show }) => {
    if (!show) return false;

    return (
      <div className='CompareModal'>
        <div className='CompareModalContainer'>
          <div className='CompareModalContent'>
            <span className='CompareModalImages'>
              {
                data.map((item) => {
                  return (
                    <img
                      key={item.id}
                      src={`${imagePath}${item.id}.png`}
                      className="CompareModalImg"
                      alt={`logo-${item.id}`}
                    />
                  )
                })
              }
            </span>

            <span className='CompareModalButtonContainer'>
              <Button
                className='CompareModalButton'
                style={{ margin: 10}}
                onClick={() => setShowCompare(false)}
                href={`/mypokedex/compare/${data[0].name}/${data[1]?.name?? undefined}`}
                disabled={data.length === 2 ? false : true}
              >
                Compare
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
    
  }, [compare]);

  
  // RENDER
  return loading ? (
    <div className="LoadingContainer">
      <img src={pokeballIcon} className="Loading" alt="logo" />

      {error.length > 0 && error}
    </div>
  ) : (
    <div className="Content">
      <MyNavbar
        hasFilter={true}
        compare={showCompare}
        callbackFilter={_callbackFilter}
        callbackShowCheckbox={_callbackShowCheckbox}
      />

      <MonsterList data={memoData} showCheckbox={showCheckbox} callbackCheckbox={_callbackCheckbox} />

      <CompareModal data={compare} show={showCompare} />

      {loadingMore && (
        <div style={{ marginBottom: 50 }}>
          <img src={pokeballIcon} className="Loading" alt="logo" />
        </div>
      )}

      {error.length > 0 && error}
    </div>
  );
}

export default Home;
