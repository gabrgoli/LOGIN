import * as React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography,Avatar,Divider, IconButton,TextField,Input } from '@mui/material'
import NavBar from '../Components/NavBar'
import LocalMallIcon from '@mui/icons-material/LocalMall';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { NavLink } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../Components/Loading'
import { MODIFYUSER,USERISLOGIN } from '../Redux/actions';
import swal from 'sweetalert'
import Cookie from 'js-cookie'
import { useSelector } from 'react-redux';

const Profile=()=>{
    const dispatch=useDispatch()
    const [field,setField]=useState({})
    const usuario=useSelector((State) => State.rootReducer.usuario);

    const user=usuario
    console.log("USER PROFILE",user)

    React.useEffect(()=>{
        dispatch(USERISLOGIN())
    },[])

    React.useEffect(()=>{
        setField(()=>({
             _id:user?._id||'',
             img:user?.img||'',
             nombre:user?.nombre||'',
             correo: user?.correo||'',
             //adress:user?.direccion||'',
            // city:user?.city||'',
             //country:user?.country||'',
             //phone:user?.phone||''
         }))
    },[])

    const [editable,setEditable]=useState({
        img:false,
        nombre:false,
        correo: false,
        password: false,
       // adress:false,
       // city:false,
       // country:false,
      //  phone:false
    })
    const handleChange=(campo)=>{
        setEditable((old)=>({...old,[campo]:true}))
    }
    const handleSave=(campo)=>{
        setEditable((old)=>({...old,[campo]:false}))
    }
    const Edit=(e)=>{
        setField((old)=>({...old,[e.target.name]:e.target.value}))
    }
    const UploadChanges=()=>{
        dispatch(MODIFYUSER(field)).then(r=>{
            if(r.payload._id)swal("Perfecto!", "Cambios guardados", "success");
        }).catch(e=>{
            swal("Oh oh!", "Algo salió mal", "error");
        })
    }
    return(
        user?<Box>
            <NavBar/>
            <Box sx={{mt:15,mb:3,marginX:{xs:3,md:'25%'},p:3,borderRadius:3,boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
            display:'flex',flexDirection:'column',justifyContent:'space-around'}}>

            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <Avatar sx={{height:200,width:200}} alt={user.nombre} src={user.img}/>
                <Typography variant='h5' sx={{fontWeight:20,m:2}}>{user.given_name||user.nombre}</Typography>

            <Divider flexItem/>

            
            <Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%'}}>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Nombre: {editable.nombre?
                    <TextField name='name' variant='standard' size='small' placeholder={field.nombre} onChange={(e)=>Edit(e)}/>
                    :field.nombre}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.name?handleSave('name'):handleChange('name')}}>
                        {editable.name?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Correo: {editable.correo?
                    <TextField name='email' variant='standard' size='small' placeholder={field.correo} onChange={(e)=>Edit(e)}/>
                    :field.correo}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.correo?handleSave('email'):handleChange('email')}}>
                        {editable.correo?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>
                
                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Dirección: {editable.adress?
                    <TextField name='adress' variant='standard' size='small' placeholder={field.adress} onChange={(e)=>Edit(e)}/>
                    :field.adress}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.adress?handleSave('adress'):handleChange('adress')}}>
                        {editable.adress?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Ciudad: {editable.city?
                    <TextField name='city' variant='standard' size='small' placeholder={field.city} onChange={(e)=>Edit(e)}/>
                    :field.city}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.city?handleSave('city'):handleChange('city')}}>
                        {editable.city?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>País: {editable.country?
                    <TextField name='country' variant='standard' size='small' placeholder={field.country} onChange={(e)=>Edit(e)}/>
                    :field.country}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.country?handleSave('country'):handleChange('country')}}>
                        {editable.country?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                    <Typography sx={{fontSize:'3vh',m:2,fontWeight:20}}>Telefono: {editable.phone?
                    <TextField name='phone' variant='standard' size='small' placeholder={field.phone} onChange={(e)=>Edit(e)}/>
                    :field.phone}
                    </Typography>
                    <IconButton sx={{bgcolor:'blue'}} onClick={(e)=>{editable.phone?handleSave('phone'):handleChange('phone')}}>
                        {editable.phone?<CheckIcon/>:<EditIcon/>}
                    </IconButton>
                </Box>

                <Divider flexItem/>

                <Box sx={{display:'flex',width:'100%',justifyContent:'center',mt:5}}>
                <IconButton sx={{display:'flex',borderRadius:1,bgcolor:'blue'}} onClick={()=>UploadChanges()}>
                    <Typography variant='body2' sx={{fontWeight:20,mt:0,mr:1,color:'black'}}>Guardar</Typography>
                    <SaveIcon/>
                </IconButton>
                </Box>
            </Box>
            </Box>

            <Box>

            </Box>

            </Box>
        </Box>:<Loading/>
    )
}

export default Profile