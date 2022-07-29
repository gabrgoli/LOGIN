import './App.css';
import * as React from 'react'

/////////// PROVIDERS ////////////////////////////
import './index.css';
import { Route, Routes } from 'react-router-dom';
import Cookie from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { GETWISHLIST,USERISLOGIN } from './Redux/actions';
///////////////////////////////////////////////////



//////////////////////////////// RUTAS //////////////////////////////////////////
import Home from './Pages/Home';
import UploadProduct from './Products/UploadProduct'
import EditProduct from './Products/EditProduct'
import Admin from './Pages/DashboardPage'
import Profile from './Pages/Profile'
import PasswordChange from './Pages/PasswordChange'
import Login from './Login/Login'
import SignUp from './Login/SignUp'
///////////////////////////////////////////////////////////////////////////////////



function App() {
  const dispatch=useDispatch()
  //const isLogged=Cookie.get('user')&&JSON.parse(Cookie.get('user')).correo?true:false
  
  const [wishlist,setWishList]=useState([])
  useEffect(()=>{
    console.log("se hicieron los dispatch del App.js")
    dispatch(USERISLOGIN())
    Cookie.get('token')?dispatch(GETWISHLIST()).then((r)=>setWishList(()=>r.payload)):setWishList(()=>[])
  },[])

  let userLogin=useSelector((state)=>state.rootReducer.usuario)
 console.log('userLogin',userLogin)
  console.log('wishlist APP',wishlist)
  return (

        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/home' element={<Home wishlist={wishlist} setWishList={setWishList}/>} />
          <Route path='/passwordchange' element={<PasswordChange/>}/>
          <Route path='/uploadproduct' element={<UploadProduct wishlist={wishlist} setWishList={setWishList}/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
    
  );
}

export default App;
