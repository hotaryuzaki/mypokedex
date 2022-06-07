import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Monster from "./pages/Monster";
import Compare from "./pages/Compare";
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
            <Route path="mypokedex/compare/:id/:id2" element={<Compare />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactContextProvider>
  );
}

export default App;
