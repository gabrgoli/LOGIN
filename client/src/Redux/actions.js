import axios from "axios"
import { createAction, createAsyncThunk } from "@reduxjs/toolkit"
import Cookie from 'js-cookie'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export const api=process.env.REACT_APP_URL_BACKEND||'http://localhost:8080'
//export const api='https://app3tech-backend.herokuapp.com'


                        /////////////////////////////////////   
                        //      ACCIONES PARA LOGIN    //   
                        ///////////////////////////////////// 

export const SIGNUPUSER = createAsyncThunk('SIGNUPUSER', async (input) => { 
    const response=await axios.post(`${api}/api/usuarios`,input)
    return response.data
})

export const LOGINUSER = createAsyncThunk('LOGINUSER', async (input) => { 
    try{
        const response=await axios.post(`${api}/api/usuarios/login`,input)
        Cookie.set('token',response.data.token)
        console.log("usuario Login Acciones:",response.data.usuario )
        return response.data.usuario
    }catch (e){
        let respuesta= JSON.parse(e.request.response).msg;
        console.log('respuesta',respuesta)
        return swal({title:"Error",text:`${respuesta}`,icon:"error",button:"Aceptar"})
    }
})

//trae todos los productos
export const GETPRODUCTS = createAsyncThunk('GETPRODUCTS', async () => { 
    const response = await axios(`${api}/api/productos`)
    return response.data
})

//devuelve las categorias de productos de la tabla category
export const GETCATEGORIES = createAsyncThunk('GETCATEGORIES', async () => { 
    const response = await axios(`${api}/api/categorias`)
    return response.data
})

// CREAR UN PRODUCTO
export const CREATEPRODUCT = createAsyncThunk('CREATEPRODUCT', async (input) => { 
    try{
        const token=Cookie.get('token')
        const response=await axios.post(`${api}/api/productos`,input ,{headers:{'x-token':token}})
        return response.data
    }catch(error){
        console.log("respuesta de CREATEPRODUCT actions ",JSON.parse(error.request.response).msg)
        
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }

})


//Agrega un producto a la Wishlist
export const ADDTOWISHLIST = createAsyncThunk('ADDTOWISHLIST', async (productId) => { 
    try{
        const token=Cookie.get('token')
        const response=await axios.post(`${api}/api/usuarios/wishlist`,productId ,{headers:{'x-token':token}})
        console.log(response.data)
        return response.data
    }catch(error){
        console.log("respuesta de ADDTOWISHLIST actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }

})

//Elimina un producto de la WishList
export const DELETEFROMWISHLIST=createAsyncThunk('DELETEFROMWISHLIST',async (productId)=>{
    try{
        const token=Cookie.get('token')
        const response=await axios.put(`${api}/api/usuarios/wishlist`,productId,{headers:{'x-token':token}})
        return response.data
    }catch(error){
        console.log("respuesta de DELETEFROMWISHLIST actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }
})

// GET productos de la Wishlist
export const GETWISHLIST = createAsyncThunk('GETWISHLIST', async () => { 
    try{
        const token=Cookie.get('token')
        const response=await axios.get(`${api}/api/usuarios/wishlist`,{headers:{'x-token':token}})
        //console.log("respuesta de wishlist actions ",response.data)
        return response.data
    }catch(error){
        console.log("respuesta de GETWISHLIST actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }

}) 

//Veridica si el usuario esta logeado
export const USERISLOGIN=createAsyncThunk('USERISLOGIN', async()=>{
    
    try{
        const token=Cookie.get('token')
        const response=await axios.get(`${api}/api/usuarios/getusuariobytoken`,{ headers:{'x-token':token}})
        //console.log("respuetsa USERISLOGIN actions",response.data)
        return response.data
     }catch(error){
        console.log("respuesta de USERISLOGIN actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }
})

//Ordena los productos por precio. La lógica se hace en el Reducer
export const ORDERBYPRICE=createAction('ORDERBYPRICE',(order)=>{ 
    return {payload:order}
})

//Veridica si el usuario es admin o user
export const VERIFYADMIN=createAsyncThunk('VERIFYADMIN',async ()=>{
    const user=JSON.parse( Cookie.get('user') )
    if(user){
        if(user.role.includes('admin'))return true
    }
    return false
})

//Devuelve todos los usuarios
export const GETUSERS = createAsyncThunk('GETUSERS', async () => { 
    const token=Cookie.get('token')
    try{
        const response = await axios(`${api}/api/usuarios`,{headers:{'x-token':`${token}`}})
        return response.data
    }catch(error){
        console.log("respuesta de GETUSERS actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }
})

//Edita el usuario
export const MODIFYUSER=createAsyncThunk('MODIFYUSER',async (input)=>{
    try{
        const token=Cookie.get('token')
        const user=await axios.put(`${api}/api/usuarios/modificarusuario/${input._id}`,input,{headers:{'x-token':`${token}`}})
        return user.data

    }catch(error){
        console.log("respuesta de MODIFYUSER actions ",JSON.parse(error.request.response).msg)
        if(JSON.parse(error.request.response).msg==='Token no válido'){
            Cookie.set('token','')
            return swal({title:"Error",text:`La sesión expiró, debe iniciar sesión de nuevo`,icon:"error",button:"Aceptar"}).then(()=>window.location.href = `/`)
        }
    }
})

//ENVIA MAIL DE CONFIRMACION                    
export const SENDEMAIL=createAsyncThunk('SENDEMAIL',async (input)=>{
    try{
        const respuesta=await axios.post(`${api}/api/usuarios/enviomail`,input)
        console.log(respuesta.data)
        swal({title:"Exito",text:`${respuesta.data.msg}: ${respuesta.data.usuario.correo}`,icon:"success",button:"Aceptar"}).then(()=>window.location.href = `/`)
        return respuesta.data

    }catch(error){
        console.log("respuesta de SENDEMAIL actions ",JSON.parse(error.request.response).msg)
            return swal({title:"Error",text:`${JSON.parse(error.request.response).msg}`,icon:"error",button:"Aceptar"})
        }
    }
)

//CAMBIO DE CONTRASEÑA
export const CHANGEPASSWORD=createAsyncThunk('CHANGEPASSWORD',async (input)=>{
    try{
        const respuesta=await axios.put(`${api}/api/usuarios/passwordchange`,input)
        console.log(respuesta.data)
        swal({title:"Exito",text:`${respuesta.data.msg}: ${respuesta.data.usuario.correo}`,icon:"success",button:"Aceptar"}).then(()=>window.location.href = `/`)
        return respuesta.data

    }catch(error){
        console.log("respuesta de SENDEMAIL actions ",JSON.parse(error.request.response).msg)
            return swal({title:"Error",text:`${JSON.parse(error.request.response).msg}`,icon:"error",button:"Aceptar"})
        }
    }
)

//Busca un producto por su nombre
export const SEARCHBYNAMEPRODUCTS=createAsyncThunk('SEARCHBYNAMEPRODUCTS',async (nombre)=>{
    const result=await axios(`${api}/api/productos?name=${nombre}`) 
    return result.data
})

//Busca todos los productos de una categoria
export const SEARCHBYCATEGORY=createAsyncThunk('SEARCHBYCATEGORY',async (nombre)=>{ 
    const result=await axios(`${api}/productps?filterName=category&filterOrder=${nombre?.toLocaleLowerCase()}&names=stock&sort=1`) 
    return result.data
})


////////////////////////////////////////////////////////////////////////////////////////



//crea una categoria
export const CREATECATEGORY = createAsyncThunk('CREATECATEGORY', async (input) => { 
    const token=Cookie.get('token')
    const response=await axios.post(`${api}/categories`,input ,{
        headers:{
            'x-access-token':token
        }
    })
    return response.data
})
//devuelve un producto, pasandole un id
export const GETPRODUCT = createAsyncThunk('GETPRODUCT', async (id) => { 
    const response = await axios(`${api}/products/${id}`,{headers:{
        'productId':`${id}`
      }})
    return response.data
})

//Edita el producto
export const MODIFYPRODUCT=createAsyncThunk('MODIFYPRODUCT',async (input)=>{
    const token=Cookie.get('token')
    const product=await axios.put(`${api}/products/${input._id}`,input,{headers:{
      'x-access-token':`${token}`
    }})
    return product.data
  })

// Elimina el producto
export const DELETEPRODUCT=createAsyncThunk('DELETEPRODUCT',async (id)=>{
const token=Cookie.get('token')
const result=await axios.delete(`${api}/products/${id}`,{
    headers:{
        'x-access-token':token
    }
}) 
return result.data
  })

//Busca un usuario por el nombre
export const SEARCHBYNAMEUSERS=createAsyncThunk('SEARCHBYNAMEUSERS',async (name)=>{
    const token=Cookie.get('token')
    const result=await axios.get(`${api}/users?name=${name}`,{
        headers:{
            'x-access-token':token
        }
    }) 
    return result.data
})









