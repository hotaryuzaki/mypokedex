import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Modal, Navbar, ToggleButton } from 'react-bootstrap';
import { FaArrowLeft, FaFilter } from "react-icons/fa";
import { FilterContext } from '../config/ReactContext';
import '../pokedex.css';

const pokemonLogo = process.env.PUBLIC_URL+"/pokemon-logo.png";

function MyNavbar(props) {
  const filterContext = useContext(FilterContext);
  const {
  	hasFilter = false,
    hasBack = false,
    compare,
    callbackFilter,
    callbackShowCheckbox
  } = props;
  const [showCheckbox, setShowCheckbox] = useState(compare);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState([...filterContext.filterValue]); // COPY ARRAY VALUE NOT REFERENCE!

  useEffect (() => {
    if (hasFilter) callbackShowCheckbox(showCheckbox);
  }, [showCheckbox])

  const setChecked = async (object, i, name, value) => {
    let update = JSON.parse(JSON.stringify(filter)); // DEEP COPY ARRAY NEEDED!
    let filterParams = [];

    // TO REMOVE OBJECT FILTER
    const filterChecked = (item) => {
      // console.log(item, `"${name}"`);
      return item !== `"${name}"`;
    }

    // FILTER BY TYPES
    if (object === 'filterTypes') {
      update[0][i].value = value;

      if (value === true) {
        update[2].count += 1;
        update[2].type.push(`"${name}"`);
      }
      else {
        update[2].count -= 1;
        filterParams = update[2].type.filter(filterChecked);
        update[2].type = filterParams;
      }
    }

    // FILTER BY GENS
    else {
      update[1][i].value = value;

      if (value === true) {
        update[2].count += 1;
        update[2].gen.push(`"${name}"`);
      }
      else {
        update[2].count -= 1;
        filterParams = update[2].gen.filter(filterChecked);
        update[2].gen = filterParams;
      }
    }

    // console.log(object, i, name, value);
    // console.log(update[2]);

    setFilter(update);
  };

  const FilterTypes = () => {
    let data = [];

    data.push(
      <p className='FilterTitle' key='FilterTypes-title'>By Types</p>  
    );

    filter[0].map((item, index) => {
      data.push(
        <ToggleButton
          key={`FilterTypes-${index}`}
          id={`FilterTypes-${index}`}
          className="FilterButton"
          size="sm"
          type="checkbox"
          variant="outline-primary"
          checked={item.value}
          onChange={(e) => setChecked('filterTypes', index, item.name, !item.value)}
        >
          {item.name}
        </ToggleButton>
      );

      return true;
    });

    return data;
  };

  const FilterGen = () => {
    let data = [];

    data.push(
      <p className='FilterTitle' key='FilterGen-title'>By Generations</p>  
    );

    filter[1].map((item, index) => {
      data.push(
        <ToggleButton
          key={`FilterGen-${index}`}
          id={`FilterGen-${index}`}
          className="FilterButton"
          size="sm"
          type="checkbox"
          variant="outline-primary"
          checked={item.value}
          onChange={(e) => setChecked('filterGen', index, item.query, !item.value)}
          >
            {item.name}
        </ToggleButton>
      );

      return true;
    });

    return data;
  };

  return (
    <>
      <Navbar className="Navbar" sticky="top">
        <Container className="NavbarContainer">
          <span className="NavbarLeft">
            {hasBack && (
              <a key="hasBack" href="/mypokedex/">
                <FaArrowLeft className="NavbarBack" />
              </a>
            )}

            <header key="NavbarLeft" className="App-header">
              <img
                src={pokemonLogo}
                className="App-logo"
                alt="logo"
              />
            </header>
          </span>

          {hasFilter && (
            <span key="hasFilter" className="NavbarRight">
              <Button
                variant="light"
                size="sm"
                href="#compare"
                className="NavbarCompare"
                onClick={() => setShowCheckbox(!showCheckbox)}
              >
                Compare
              </Button>

              <a
                className="NavbarFilter"
                href="#filter"
                onClick={() => setShowModal(true)}
              >
                <FaFilter className="NavbarFilterIcon" />
                {filter[2].count > 0 && (
                  <span className="FilterBadge">{filter[2].count}</span>
                )}
              </a>
            </span>
          )}
        </Container>
      </Navbar>

      <Modal
        show={showModal}
        fullscreen="lg-down"
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter</Modal.Title>
        </Modal.Header>

        <div className="FilterContainer">
          <div className="FilterSegment">
            <FilterTypes />
          </div>
          <div className="FilterSegment">
            <FilterGen />
          </div>
        </div>

        <Button
          style={{ margin: 10 }}
          onClick={() => {
            callbackFilter(filter);
            setShowModal(false);
          }}
        >
          Terapkan Filter
        </Button>
      </Modal>
    </>
  );
}

export default MyNavbar;
