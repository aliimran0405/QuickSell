import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import GeneralItems from './pages/GeneralItems';
import ItemDetails from './pages/ItemDetails';
import Nav from './Components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import CreateItem from './pages/CreateItem';



function App() {
  return(
    <>
      <Nav />
      <Routes>
        <Route path='/general-items' element={<GeneralItems />}/>
        <Route path='/general-items/:itemId' element={<ItemDetails />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/my-page' element={<MyPage />}/>
        <Route path='/general-items/new' element={<CreateItem />}/>
        <Route path='/general-items/edit/:itemId' element={<CreateItem />}/>
      </Routes>
    </>
  );
}

export default App
