import { Box, Grid, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
//import { AuthLayout } from '../../components/layouts';
import {Link} from 'react-router-dom'
import {useDispatch} from "react-redux"
import {SIGNUPUSER,LOGINUSER,USERISLOGIN} from "../Redux/actions"
import {useEffect, useState} from "react"
import { AppDispatch,RootState } from '../Redux/store';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Cookie from 'js-cookie'
import swal from 'sweetalert';
import axios from "axios"
export const api=process.env.REACT_APP_URL_BACKEND||'http://localhost:8080'

const useAppDispatch = () => useDispatch();


const RegisterPage = () => {
    const navigate=useNavigate()
    const[disabled,setDisabled]=useState(true)
    const [input,setInput]=useState({
        correo:"",
        password:"",
        nombre:"",
        adress:"",
        city:"",
        country:"",
        phone:"",
        avatar:'',
        rol:""
    })
    const[images,setImages]=useState('');//array de strings de url de imagenes 
    
    const[upLoading,setUpLoading]=useState(false)

    const [error,setError]=useState({
        correo:false,
        password:false,
        name:false,
        adress:false,
        city:false,
        country:false,
        phone:false,
        avatar:false,
        rol:false
    })

    const handleDelete=(e)=>{
        e.preventDefault()
        setImages('')
        setInput((input)=>({...input,avatar:''}))
      //eliminar el elemento que tenga la misma url 
      }
      
      const handleUpload= async (e)=>{
        
        const pic = e.target.files[0];
        if (pic===undefined)  return  0
        setUpLoading(true);
        const formData=new FormData();
        formData.append('file',pic);
        formData.append('upload_preset','images');
        
         await fetch('https://api.cloudinary.com/v1_1/dnlooxokf/upload',{
          method: 'POST',
          body: formData,
        })
          .then((res)=>res.json())
          .then((res)=> {
            setImages(()=>res.url);
            setInput((input)=>({...input,avatar:res.url}))
            setUpLoading(false);
          })
          .catch(error=>console.log(error));
      };

    const dispatch=useAppDispatch()

    const handleSubmit=async(e)=>{
        e.preventDefault()
        console.log("input",input)
        try{
            //dispatch(SIGNUPUSER(input))
            const response=await axios.post(`${api}/api/usuarios`,input)
            console.log('respueta',response)
            if(response.data.msg==="se creo el usuario exitosamente"){
                const response=await axios.post(`${api}/api/usuarios/login`,input)
                if(response.data.msg==="login correcto ok"){
                    Cookie.set('token',response.data.token)
                    Cookie.set('user',JSON.stringify(response.data.usuario))
                    dispatch(USERISLOGIN())
                    return swal({title:"Éxito",text:`${response.data.msg}`,icon:"success",button:"Aceptar"}).then(
                        ()=>navigate("/home")
                    )
                }
            }
        }catch(e){
            console.log('e',e)
            let respuesta= JSON.parse(e.request.response).msg;
            console.log('respuesta',respuesta)
            return swal({title:"Error",text:`${respuesta}`,icon:"error",button:"Aceptar"})
        }

    }

    const handleChange=(e)=>{
        e.preventDefault();
        setError(()=>({
            correo:false,
            password:false,
            nombre:false,
            adress:false,
            city:false,
            country:false,
            phone:false,
            avatar:false,
            rol:false
        }))
        const rgmail=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const rgpassword=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        const rgdirec=/^[A-Za-z0-9\s]+$/g
        const rgphone=/^([0-9])*$/
        

        setInput((prev) => ({...prev, [e.target.name]:e.target.value}))
        input.adress && input.phone && input.correo && input.city && input.country && input.password?setDisabled(()=>false):setDisabled(()=>true)
        
        if(e.target.name==='correo'){
            if(!rgmail.test(e.target.value)){
                setError((old)=>({...old,correo:true}))
                setDisabled(()=>true)
            }
        }
        if(e.target.name==='password'){
            if(!rgpassword.test(e.target.value)){
                //setError((old)=>({...old,password:true}))
                //setDisabled(()=>true)
            }
        }
        if(e.target.name==='adress'){
            if(!rgdirec.test(e.target.value)){
                setError((old)=>({...old,adress:true}))
                setDisabled(()=>true)
            }
        }
        if(e.target.name==='phone'){
            if(!rgphone.test(e.target.value)){
                setError((old)=>({...old,phone:true}))
                setDisabled(()=>true)
            }
        }
        if(e.target.name==='rol'){
            if(!rgphone.test(e.target.value)){
                setError((old)=>({...old,cuil:true}))
                setDisabled(()=>true)
            }
        }

    }


    return(
        <Box sx={{display:'flex',justifyContent:'center'}} >
            <Box sx={{width:350, padding:'10px 20px'}} >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h3'>Crear Cuenta</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField name='nombre' label='Nombre y Apellido' value={input.nombre} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.email} name='correo' label='Correo' value={input.correo} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.password} name='password' label='Contraseña' value={input.password} onChange={(e)=>handleChange(e)} type='password' variant="filled" fullWidth></TextField>
                        {error.password && <Typography sx={{color:"red",fontSize:12}}>Debe contener al menos 8 caracteres</Typography>}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.adress} name='adress' label='Dirección' value={input.adress} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                        {error.adress && <Typography sx={{color:"red",fontSize:12}}>Debe ser una dirección</Typography>}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.city} name='city' label='Ciudad' value={input.city} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.country} name='country' label='Pais' value={input.country} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField error={error.phone} name='phone' label='Teléfono' value={input.phone} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                        {error.phone && <Typography sx={{color:"red",fontSize:12}}>Debe ser un numero de telefono</Typography>}
                    </Grid>

                    {/* <Grid item xs={12}>
                        <TextField error={error.rol } name='rol' label='Rol' value={input.rol} onChange={(e)=>handleChange(e)} variant="filled" fullWidth></TextField>
                        {error.rol && <Typography sx={{color:"red",fontSize:12}}>Debe ser un numero de CUIL</Typography>}
                    </Grid> */}

                    <Box>
                        <Select
                            id="formcats"
                            select
                            label="Rol de usuario"
                            value={input.rol}
                            onChange={(e)=>handleChange(e)}
                            name='rol'
                            fullWidth
                        >
                            
                            
                            <MenuItem value='USER_ROLE'>Usuario</MenuItem>
                            <MenuItem value='ADMIN_ROLE'>Admin</MenuItem>
                            
                        </Select>

                    </Box>  

                    <Box sx={{m:2,display:'flex',flexDirection:'column'}}>
                        <Typography>Foto de perfil</Typography>
                    {<input aria-label="Archivo" type="file" name="imagen" onChange={handleUpload}/>}
                    </Box>

                    <Box display='flex' flexDirection='row' justifyContent='center'  >
                        
                        {images?(
                        <Box sx={{ paddingX: 2 }}>
                            <img src={images} alt="" width="250px" height ="150px" />
                            <button onClick={(e)=>{handleDelete(e)}}>X</button>
                        </Box>)
                        :<></>}
                    </Box>
                    {upLoading && <p>Subiendo Foto...</p> }
                    
                    <Grid xs={12} sx={{mt:3}} >
                        <Button onClick={(e)=>handleSubmit(e)} color = "secondary" className='circular-btn' size='large' fullWidth disabled={false}>
                            Crear
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        
                            <Link to='/'>
                                ¿ya tenes una cuenta?
                            </Link>
                  
                    </Grid>

                    

                </Grid>
                
            </Box>

        </Box>
    )
}

export default RegisterPage