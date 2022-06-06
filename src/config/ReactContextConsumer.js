// React Context - Consuming Multiple Contexts
// To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.
// If two or more context values are often used together, you might want to consider creating your own render prop component that provides both.
// source: https://reactjs.org/docs/context.html#consuming-multiple-contexts

// ReactContextConsumer a component that will call from MainNavigator.js as screen wrapper if they need global state

import React from 'react';
import { FilterContext } from './ReactContext';

const useContext = Component => {
  return props => (
    <FilterContext.Consumer>
      {({ filterValue, setFilterValue }) => (
        <Component
          {...props}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
      )}
    </FilterContext.Consumer>
  );
}

export default useContext;
