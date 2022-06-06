// React Context - Consuming Multiple Contexts
// To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.
// If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.
// source: https://reactjs.org/docs/context.html#consuming-multiple-contexts

// ReactContextProvider a component that will call from App.js to set global state in app root

import React, { useState } from 'react';
import { FilterContext } from './ReactContext';
import filterObjects from '../filterObjects.js';

const ReactContextProvider = (props) => {
  const [filterValue, setFilterValue] = useState([
    filterObjects.filterTypes,
    filterObjects.filterGen,
    {
      count: 0,
      type: [],
      gen: [],
    }
  ]);
  

  return (
    <FilterContext.Provider value={{
      filterValue: filterValue,
      setFilterValue: (value) => setFilterValue(value)
    }}>
      {props.children}
    </FilterContext.Provider>
  );
}

export default ReactContextProvider;
