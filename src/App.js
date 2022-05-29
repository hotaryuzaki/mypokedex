import React from 'react';
import Home from './pages/Home';
import './pokedex.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src='https://www.freepnglogos.com/uploads/pokemon-logo-text-png-7.png' className="App-logo" alt="logo" />
      </header>

      <div className='Container'>
        <Home />
      </div>
    </div>
  );
}

export default App;
