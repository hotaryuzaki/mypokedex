import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { Toast, ToastContainer } from 'react-bootstrap';
import useNetwork from "../hooks/useNetwork";
import '../pokedex.css';

const pokeballIcon = process.env.PUBLIC_URL+"/pokeball-icon.svg";

function Layout() {
  const networkState = useNetwork();
  const { online } = networkState;
  const [show, setShow] = useState(!online);

  useEffect(() => {
    setShow(!online);
  }, [online]); // USEEFFECT UNTUK PERUBAHAN NETWORK STATUS
  
  return(
    <div className='Content'>
      <header className="App-header">
        <img src='https://www.freepnglogos.com/uploads/pokemon-logo-text-png-7.png' className="App-logo" alt="logo" />
      </header>

      <div className='Container'>
        <Outlet />
      </div>
      
      {
        !online
          ? // NETWORK OFFLINE
          <ToastContainer className="position-fixed p-3" position='bottom-end'>
            <Toast onClose={() => setShow(!show)} show={show} delay={5000} autohide>
              <Toast.Header>
                <strong className="me-auto">My Pokedex</strong>
              </Toast.Header>
              <Toast.Body>Tidak ada koneksi internet.</Toast.Body>
            </Toast>
          </ToastContainer>

          : // NETWORK ONLINE
          <ToastContainer className="position-fixed p-3" position='bottom-end'>
            <Toast onClose={() => setShow(!show)} show={!show} delay={5000} autohide>
              <Toast.Header>
                <img src={pokeballIcon} className="ToastImage" alt="toast-icon" />
                <strong className="me-auto">My Pokedex</strong>
              </Toast.Header>
              <Toast.Body>Selamat datang di My Pokedex.</Toast.Body>
            </Toast>
          </ToastContainer>
      }
    </div>
  );
}

export default Layout;
