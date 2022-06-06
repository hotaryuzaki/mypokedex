import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Monster from "./pages/Monster";
import ReactContextProvider from './config/ReactContextProvider';

import './pokedex.css';

function App() {
  return (
    <ReactContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mypokedex" element={<Home />} />
            <Route path="mypokedex/:id" element={<Monster />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactContextProvider>
  );
}

export default App;
