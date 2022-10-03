import { Box,Divider, Typography, TextField, Button,FormControl,Container ,CardMedia,InputAdornment,OutlinedInput, Input, InputLabel} from '@mui/material';
import {Link} from 'react-router-dom'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import '@fontsource/roboto/300.css';
import {useDispatch,useSelector} from "react-redux"
import {LOGINUSER,USERISLOGIN,GETWISHLIST} from "../Redux/actions"
import { AppDispatch,RootState } from '../Redux/store';
import '../index.css';
import jwt_decode from "jwt-decode";
import axios from "axios"
import Cookie from 'js-cookie'
import swal from 'sweetalert';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Facebook from "../img/facebook.png";
import Github from "../img/github.png";
import Instagram from "../img/instagram.png";

export const api=process.env.REACT_APP_URL_BACKEND||'http://localhost:8080'


const LoginPage = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
      const getUser = () => {
        fetch("http://localhost:8080/api/usuarios/login/success", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
          .then((response) => {
            if (response.status === 200) return response.json();
            throw new Error("authentication has been failed!");
          })
          .then((resObject) => {
            setUser(resObject.user);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getUser();
    }, []);
  
console.log('usuario',user)


    const github = () => {
        window.open("http://localhost:8080/api/usuarios/github", "_self");
      };
    
      const facebook = () => { 
        window.open("http://localhost:8080/api/usuarios/facebook", "_self");
      };
    
      const instagram = () => { 
        window.open("http://localhost:8080/api/usuarios/instagram", "_self");
      };


    const useAppDispatch = () => useDispatch();
    const dispatch=useAppDispatch()
    const [invalid,setInvalid]=useState(false)
    const [error,setError]=useState(false)
    const [input,setInput]=useState({
        correo:"",
        showPassword: false,
        password:""
    })

    const handleChange=(e)=>{
        e.preventDefault();
        setError(()=>false)
        // const rgmail=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        // if(!rgmail.test(input.correo))setError(()=>true)
        setInput((prev) => ({...prev, [e.target.name]:e.target.value}))

    }
    const navigate=useNavigate()

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const rgmail=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if(!rgmail.test(input.correo))setError(()=>true)
        dispatch(LOGINUSER(input))
        return swal({title:"Éxito",text:`Loin Exitoso`,icon:"success",button:"Aceptar"}).then(()=>navigate("/home"))
               
          /*  }
        }catch (e){
            let respuesta= JSON.parse(e.request.response).msg;
            console.log('respuesta',respuesta)
            return swal({title:"Error",text:`${respuesta}`,icon:"error",button:"Aceptar"})
        }*/
    }

///////////////////////// ICONO DE OJITO PARA PASSWORD CON FUNCINALIDAD /////////////////////////////////////////
    const handleClickShowPassword = () => {
        setInput({
          ...input,
          showPassword: !input.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////Ç

//////////////////////////////////////  GOOGLE SIGNIN SIGNUP  /////////////////////////////////
    async function handleCallbackResponse(response){
        console.log("token",response.credential)
        var userObject = jwt_decode(response.credential);
        console.log("userObject",userObject)
        try{
            const res=await axios.post(`${api}/api/usuarios/google`, {id_token : response.credential})
            console.log("res",res)
            if(res.data.msg==="googleLogin Correcto"){
                return swal({title:"Éxito",text:`${res.data.msg}`,icon:"success",button:"Aceptar"}).then(
                    Cookie.set('token',res.data.token)).then(
                    //Cookie.set('user',JSON.stringify(res.data.usuario))).then(
                    ()=>dispatch(USERISLOGIN())).then(
                    ()=>navigate("/home")
                )
            }
        }catch(res){
            console.log("res",res.response.data.msg)
            return swal({title:"Error",text:`${res.response.data.msg}`,icon:"error",button:"Aceptar"})
        }
      } 

    useEffect(()=>{
        /*global google*/
        google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_ID,
        callback: handleCallbackResponse
        });
        google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {theme:"outline",size:"large"}
        );
    
    },[]);
////////////////////////////////////////////////////////////////////////////////////////////


    return(
        <form>
        <Box display='flex' flexDirection='row' justifyContent='center' margin='90px'>

            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',border:'1px solid gray',borderRadius:2,width:320,bgcolor:'white',boxShadow:10}}>

                <CardMedia
                    component="img"
                    height="auto"
                    image={require('../Components/3TECH.png')}
                    alt="gf"
                    sx={{objectFit:'contain'}}
                />
            
                {error && <Typography sx={{m:0,fontSize:{xs:10,sm:15},color:'red'}}>Usuario o contraseña incorrectos</Typography>}
                
                <TextField 
                id="filled-size-normal"
              //  variant="filled" 
                label='correo'
                autoFocus error={error} 
                name='correo' 
                //placeholder='Correo'  
                onChange={(e)=>handleChange(e)}  
                size='small' 
                sx={{marginY:1,marginX:4}}>

                </TextField>


              
        
                <OutlinedInput 
                    id="outlined-adornment-password"
                    //variant='filled'
                    
                    //placeholder='Contraseña'
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                          
                        {input.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                       
                    </InputAdornment>
                    }
                    name='password' value={input.password} label='hola'  type={input.showPassword ? 'text' : 'password'} onChange={(e)=>handleChange(e)}  size='small' sx={{marginY:2,marginX:4}}>

                </OutlinedInput>
        


                <Button onClick={handleSubmit} type='submit' value='buscar' className='circular-btn' size='small' sx={{color:'white',marginY:1,marginX:4}}>
                        Ingresar
                </Button>
            
                <Button  className='circular-btn' size='small' sx={{color:'white', marginY:1,marginX:4}}
                    //onClick={()=>Cookie.set('token','').then(dispatch(USERISLOGIN())).then(dispatch(GETWISHLIST())).then((navigate('/home')))}>
                    onClick={()=>Cookie.get('token')==='invitado'?((navigate('/home'))):Cookie.set('token','invitado')}>
                        Entrar como Invitado
                </Button>

                <Box sx={{marginX:4}}>
                    <h3>Google Signin</h3>
                    <div id="signInDiv"></div>
                </Box>
                <Box display='flex' justifyContent="center">
    
                    <div className="loginButton facebook" onClick={facebook} >
                        <img src={Facebook} alt="" className="icon" />
                        Facebook
                    </div>
                </Box>

                    <Box display='flex' justifyContent="center"  >
                        <div className="loginButton paypal" onClick={github} >
                            <img src={Github} alt="" className="icon" />
                            Paypal
                        </div>
                    </Box>

                    
                    <Box display='flex' justifyContent="center"  >
                        <div className="loginButton instagram" onClick={instagram} >
                            <img src={Instagram} alt="" className="icon" />
                            Instagram
                        </div>
                    </Box>

                    <Box display='flex' justifyContent="center"  >
                        <div className="loginButton github" onClick={github} >
                            <img src={Github} alt="" className="icon" />
                            Github
                        </div>
                    </Box>

                <Divider >o</Divider>
                
                <Typography sx={{marginTop:1,marginX:4}} fontSize={14}>Olvidaste tu Contraseña?<Link to='/enviomail'>Recuperar</Link></Typography>
                <Typography sx={{marginBottom:1,marginX:4}} color='black' fontSize={14} >No tienes cuenta? <Link to='/signup'>Crear</Link></Typography>
            </Box>
        </Box>


        </form>
    )
}

export default LoginPage