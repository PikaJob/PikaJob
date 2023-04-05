//--------------------------------- START OF IMPORT-----------------------------
import './assets/style.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Title from './components/Title';
import Home from './components/Home';
import JobInformation from './components/JobInformation';

// ----------------------- START OF REACT & REACT ROUTER -----------------------
const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <BrowserRouter>
    <Title />
    <Routes>
      <Route path='/' element={<Home />} />
      {/* https://flaviocopes.com/react-router-data-from-route/ */}
      <Route path='/:id' element={<JobInformation />} />
      {/* <Route path='*' element={<404 />} /> */}
    </Routes>
  </BrowserRouter>,
);
