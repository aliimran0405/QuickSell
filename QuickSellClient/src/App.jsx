import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import GeneralItems from './pages/GeneralItems';
import ItemDetails from './pages/ItemDetails';
import Nav from './Components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import CreateItem from './pages/CreateItem';
import Modal from './Components/Modal';
import Forbidden from './Components/Forbidden';
import Landing from './pages/Landing';
import MyItemDetails from './pages/MyItemDetails';
import MyAds from './pages/MyAds';



function App() {
  return(
    <>
      <Nav />
      <Routes>
        <Route path='/' element={<Landing />}/>
        <Route path='/general-items' element={<GeneralItems />}/>
        <Route path='/general-items/:itemId' element={<ItemDetails />}/>
        <Route path='/general-items/my-ads/:itemId' element={<MyItemDetails />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/my-page' element={<MyPage />}/>
        <Route path='/my-page/my-ads' element={<MyAds />}/>
        <Route path='/general-items/new' element={<CreateItem />}/>
        <Route path='/general-items/edit/:itemId' element={<CreateItem />}/>
        <Route path='/test' element={<Modal />}/>

        <Route path='/forbidden' element={<Forbidden />}/>
      </Routes>
    </>
  );
}

export default App
