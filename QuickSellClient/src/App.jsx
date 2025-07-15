import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import GeneralItems from './pages/GeneralItems';
import ItemDetails from './pages/ItemDetails';
import Nav from './Components/Nav';



function App() {
  return(
    <>
      <Nav />
      <Routes>
        <Route path='/general-items' element={<GeneralItems />}/>
        <Route path='/general-items/:itemId' element={<ItemDetails />}/>
      </Routes>
    </>
  );
}

export default App
