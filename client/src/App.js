import './App.css';
import * as React from 'react'
import  'bootstrap/dist/css/bootstrap.min.css'
/////////// PROVIDERS ////////////////////////////
import './index.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cookie from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { GETWISHLIST,USERISLOGIN } from './Redux/actions';
///////////////////////////////////////////////////



//////////////////////////////// RUTAS //////////////////////////////////////////
import Home from './Pages/Home';
import UploadProduct from './Products/UploadProduct'
import EditProduct from './Products/EditProduct'
import Admin from './Pages/Admin'
import Profile from './Pages/Profile'
import PasswordChange from './Pages/PasswordChange'
import EnvioMail from './Pages/EnvioMail'
import Login from './Login/Login'
import SignUp from './Login/SignUp'
///////////////////////////////////////////////////////////////////////////////////



function App() {
  const dispatch=useDispatch()
  //const isLogged=Cookie.get('user')&&JSON.parse(Cookie.get('user')).correo?true:false
  
  let userLogin=useSelector((state)=>state.rootReducer.usuario)
  console.log("userLogin",userLogin)
 // console.log('wishlist APP',wishlist)
  return (

        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/passwordchange/:tokenId' element={<PasswordChange/>}/>
          <Route path='/enviomail' element={<EnvioMail/>}/>
          <Route path='/uploadproduct' element={<UploadProduct/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
    
  );
}

export default App;
