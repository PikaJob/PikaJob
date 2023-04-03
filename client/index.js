//--------------------------------- START OF IMPORT-----------------------------
import React from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import FirstPath from './components/FirstPath.jsx';
// import SecondPath from './components/SecondPath.jsx';

// ----------------------- START OF REACT & REACT ROUTER -----------------------
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <div>Hello World</div>,
  // REMEMBER - add 404 route!!!!!
  // <BrowserRouter>
  //   <Nav />
  //   <Routes>
  //     <Route path='/FirstPath' element={<FirstPath />} />
  //     <Route path='/SecondPath' element={<SecondPath />} />
  //     <Route path='/' element={<Home />} />
  //   </Routes>
  // </BrowserRouter>,
);
