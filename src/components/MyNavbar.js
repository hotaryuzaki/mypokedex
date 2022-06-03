import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Modal, Navbar, ToggleButton } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import '../pokedex.css';
import filterObjects from '../filterObjects.js';

function MyNavbar(props) {
  const {
  	hasFilter = false,
    hasBack = false,
    callbackFilter
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState([filterObjects.filterTypes, filterObjects.filterGen]);

  useEffect(() => {
    // console.log('NEW', filter);

  }, [filter]);

  const setChecked = (name, i, value) => {
    let update = [...filter];
    console.log(name, i, value);
    // console.log(i, update[0][i]);
    if (name === 'filterTypes') update[0][i].value = value;
    else update = update[1][i].value = value;

    setFilter(update);
  };

  const FilterTypes = () => {
    let data = [];

    data.push(
      <p className='FilterTitle' key='FilterTypes-title'>By Types</p>  
    );

    filter[0].map((item, index) => {
      // console.log('FilterTypes', index);
      data.push(
        <ToggleButton
          key={`FilterTypes-${index}`}
          className="FilterButton"
          size="sm"
          id="FilterTypes-check"
          type="checkbox"
          variant="outline-primary"
          checked={item.value}
          value={item.name}
          onChange={(e) => setChecked('filterTypes', index, !item.value)}
        >
          {item.name}
        </ToggleButton>
      );
    });

    // console.log(data);

    return data;
  };

  const FilterGen = () => {
    let data = [];

    data.push(
      <p className='FilterGen' key='FilterGen-title'>By Generations</p>  
    );

    filter[1].map((item, index) => {
      // console.log('FilterTypes', index);
      data.push(
        <ToggleButton
          key={`FilterGen-${index}`}
          className="FilterButton"
          size="sm"
          id="FilterGen-check"
          type="checkbox"
          variant="outline-primary"
          checked={item.value}
          value={item.name}
          onChange={(e) => setChecked('filterTypes', index, !item.value)}
        >
          {item.name}
        </ToggleButton>
      );
    });

    // console.log(data);

    return data;
  };

  return (
    <>
      <Navbar bg="light" sticky="top">
        <Container className='NavbarContainer'>
          <span className='NavbarLeft'>
            {
              hasBack && (
                <a href="/mypokedex/">
                  <FaArrowLeft className='NavbarBack' />
                </a>
              )
            }

            <header className="App-header">
              <img src='https://www.freepnglogos.com/uploads/pokemon-logo-text-png-7.png' className="App-logo" alt="logo" />
            </header>
          </span>
          
          {
            hasFilter && (
              <span className='NavbarRight'>
                <Button variant="light" size="sm" href='#compare' className='NavbarCompare' >
                  Compare
                </Button>

                <a href="#filter" onClick={() => setShowModal(true)}>
                  <FaFilter className='NavbarFilter' />
                </a>
              </span>
            )
        }
        </Container>
      </Navbar>

      <Modal show={showModal} fullscreen='lg-down' onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Filter</Modal.Title>
          </Modal.Header>

          <FilterTypes />
          <FilterGen />
          

          <Button
            // onClick={
            //   () => {
            //     callbackFilter(['fire']);
            //   }
            // }
          >
            Filter
          </Button>
        </Modal>
    </>
  );
}

export default MyNavbar;
