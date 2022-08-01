import React from "react";
import NavBar from "../Components/NavBar"
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Box, InputLabel, OutlinedInput, InputAdornment, Typography, Button } from '@mui/material';
import { SENDEMAIL } from '../Redux/actions'
import IconButton from '@mui/material/IconButton';

import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';

function validate(mail){
  let errors = {} //creo un objeto vacio
  if (!mail){ errors.mail = "Tu contraseña no puede ser vacía"} 
  return errors
}


export default function EnvioMail() {

  //const dispatch=useDispatch()
  const navegar = useNavigate()  //para navegar al home luego de postear el formulario
  const dispatch=useDispatch()
  const [mail, setMail] = React.useState({
    correo: '',
  });

  const [errors, setErrors] = useState({}) //estado local para manejar errores, objeto vacio

  const handleChange = (prop) => (event) => {
    setMail({ ...mail, [prop]: event.target.value });

    setErrors(validate({ //setea mi funcion errores pasando la funcion validate con variable post
      ...mail,
      [prop]: event.target.value
  }))
  };


  
    function handleSubmit(e){
      e.preventDefault()
      console.log(mail)
      dispatch(SENDEMAIL(mail))
          //navegar("/")//se accede al home
         // window.location.reload();//se refresca para activar el dispatch de GETPRODUCTS()       
  }


  return (
      <div>
        <NavBar/>

        

        <Box display='flex'  mt={5}  justifyContent='center' >
        
              <FormControl  variant="outlined">
              <Typography display='flex' justifyContent='center' variant='h4' mb={3} marginTop={15}>Enviar mail de Recuperación</Typography>
                <InputLabel htmlFor="outlined-adornment-password" >Nueva contraseña</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="correo"
                  type='text'
                  value={mail.correo}
                  onChange={handleChange('correo')}
                  endAdornment={
                    <InputAdornment position="end">
                    </InputAdornment>
                  }
                  label="mail"
                />                                         
                    <Button 
                      fullWidth 
                      sx={{ marginTop: 3 }} 
                      disabled={mail===""|| errors.password}  
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
