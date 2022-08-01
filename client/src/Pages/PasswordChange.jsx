import React from "react";
import NavBar from "../Components/NavBar"
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import {Box, InputLabel, OutlinedInput, InputAdornment, Typography, Button /*TextField,Select,Container, CardMedia,Link, FormLabel, FormControlLabel, UploadOulined, MenuItem*/  } from '@mui/material';
import { useDispatch } from 'react-redux'
import { CHANGEPASSWORD } from '../Redux/actions'

import IconButton from '@mui/material/IconButton';
//import Input from '@mui/material/Input';
//import FilledInput from '@mui/material/FilledInput';
//import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';


function validate(newPass){
  let errors = {} //creo un objeto vacio
  
  if (!newPass.password){ 
      errors.password = "Tu contraseña no puede ser vacía"
  } else if (newPass.password.length<6){
      errors.password = "tu contraseña debe tener por lo menos 6 caracteres"
  } 
 /* else if (!(/\d/.test(newPass.password))){//verifica si tiene numero
    errors.password = "tu contraseña debe tener por lo menos 1 número"
}*/

  return errors
}

export default function PasswordChange() {

  const {tokenId}=useParams()
  const dispatch=useDispatch()
  console.log("cual es el id de usuario:",tokenId)
  const navegar = useNavigate()  //para navegar al home luego de postear el formulario
  const [newPass, setnewPass] = React.useState({
    password: '',
    showPassword: false,
    tokenId:tokenId
  });

  const [errors, setErrors] = useState({}) //estado local para manejar errores, objeto vacio

  const handleChange = (prop) => (event) => {
    setnewPass({ ...newPass, [prop]: event.target.value });

    setErrors(validate({ //setea mi funcion errores pasando la funcion validate con variable post
      ...newPass,
      [prop]: event.target.value
  }))
  };

  const handleClickShowPassword = () => {
    setnewPass({
      ...newPass,
      showPassword: !newPass.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  
    function handleSubmit(e){
     e.preventDefault()
     dispatch(CHANGEPASSWORD(newPass))
     //console.log("newPass",newPass)
   
  }


  return (
      <div>
        <NavBar/>

        

        <Box display='flex'  mt={5}  justifyContent='center' >
        
              <FormControl  variant="outlined">
              <Typography display='flex' justifyContent='center' variant='h4' mb={3} marginTop={15}>Cambio de contraseña</Typography>
                <InputLabel htmlFor="outlined-adornment-password" >Nueva contraseña</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  type={newPass.showPassword ? 'text' : 'password'}
                  value={newPass.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {newPass.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />                                         
                    <Button 
                      fullWidth 
                      sx={{ marginTop: 3 }} 
                      disabled={newPass.password===""|| errors.password}  
                      width="100%" 
                      type="submit" 
                      variant="contained"
                      onClick={(e) => handleSubmit(e)}>
                        Cambiar contraseña
                    </Button>
              </FormControl>
        </Box>
        <Typography display='flex' justifyContent='center'>{errors.password && (<p >{errors.password}</p>)}</Typography>
      </div>
    );
  }
