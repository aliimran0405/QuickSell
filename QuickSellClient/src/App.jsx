import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import GeneralItems from '../pages/GeneralItems';
import Nav from '../Components/Nav';



function App() {
  return(
    <>
      <Nav />
      <Routes>
        <Route path='/general-items' element={<GeneralItems />}/>
      </Routes>
    </>
  );
}

export default App
