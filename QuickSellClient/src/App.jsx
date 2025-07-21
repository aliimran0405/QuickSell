import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import GeneralItems from './pages/GeneralItems';
import ItemDetails from './pages/ItemDetails';
import Nav from './Components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';



function App() {
  return(
    <>
      <Nav />
      <Routes>
        <Route path='/general-items' element={<GeneralItems />}/>
        <Route path='/general-items/:itemId' element={<ItemDetails />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App
