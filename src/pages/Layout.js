import React from 'react';
import { Outlet } from "react-router-dom";
import '../pokedex.css';

function Layout() {
  return(
    <div className='Content'>
      <header className="App-header">
        <img src='https://www.freepnglogos.com/uploads/pokemon-logo-text-png-7.png' className="App-logo" alt="logo" />
      </header>

      <div className='Container'>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
