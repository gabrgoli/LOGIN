import React from "react";
import NavBar from "../Components/NavBar"
import { useState,useRef } from 'react';
import {   useNavigate } from "react-router-dom"
//import { Link } from "react-router-dom";
import { TextField,Select,Container, CardMedia,Link, Box, UploadOulined,InputLabel, OutlinedInput, InputAdornment, MenuItem, Typography, Button, FormLabel, FormControlLabel } from '@mui/material';
import {CREATECATEGORY, CREATEPRODUCT,GETCATEGORIES,GETPRODUCTS} from '../Redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { UploadOutlined } from '@ant-design/icons';
import Checkbox from '@mui/material/Checkbox';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import swal from 'sweetalert';


export default function CrearPublicacion() {


  const fileInputRef=useRef(null)
  const dispatch=useDispatch()
  React.useEffect(()=>{
      dispatch(GETCATEGORIES())
  },[dispatch])
  const categories=useSelector((state)=>state.rootReducer.categories)
  const[input,setInput]=useState({nombre:'',precio:'',categoryia:'Select',descripcion:'',disponible:true,imagenes:[""],estado:true})
  const[images,setImages]=useState([]);//array de strings de url de imagenes 
  const[upLoading,setUpLoading]=useState(false) //estado que sirve para mostrar "cargando foto"
  const navegar = useNavigate()  //para navegar al home luego de postear el formulario
  const [checked, setChecked] = React.useState(false);

///////////////////////// SUBIR FOTO A CLOUDINARY /////////////////////
  const handleUploadImage=  (e)=>{
    const pics = e.target.files;
    if (pics[0]===undefined)  return  0

    setUpLoading(true); //marcador de loading...
   
    for(const pic of pics){
      let formData=new FormData();
      formData.append('file',pic);
      formData.append('upload_preset','images');
       fetch('https://api.cloudinary.com/v1_1/dnlooxokf/upload',{
        method: 'POST',
        body: formData,
      })
        .then((res)=>res.json())
        .then((res)=> {
          setImages(images=>[...images,res.url]);
          setUpLoading(false);
        })
        .catch(error=>console.log(error));
      }
  };
///////////////////////////////////////////////////////////////////////////////////////


  const handleDelete=(e,image)=>{
    e.preventDefault()
  //   images.forEach( async(image) => {
  //     if ( images.includes(image) ){
  //         // Borrar de cloudinary
  //         const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
  //         console.log({ image, fileId, extension });
  //         //await cloudinary.uploader.destroy( fileId );
  //     }
  // });

  setImages(images.filter(element=>//deja afuera el elemento que tenga la url a eliminar
    element!==image
  ))

  }
/////////////CHECKBOX FUNCION//////////////
  const checkBox = (event) => { 
    console.log("evento check",event)
    setChecked(event.target.checked);
    checked===false?setInput((input)=>({...input, category:''}))
    :setInput((input)=>({...input, category:'Select'}))
  };
/////////////////////////////////////////////


///////////////////// FUNCION VALIDAR ///////////////////////
  const validate=(ev)=>{

    if(ev.target.name==='nombre'){
      setInput((input)=>({...input,nombre:ev.target.value}))
    }

   // else if(ev.target.name==='precio' && ev.target.value>-1 && (/\d/.test(ev.target.value))||( ev.target.name==='precio' && ev.target.value==='.') ){
    else if ((ev.target.name==='precio' )&& ((/\d/.test(ev.target.value)) || (ev.target.value==='')) ) {  
      setInput((input)=>({...input,precio:(parseFloat(ev.target.value))}))
    }

    else if(ev.target.name==='description'){
      setInput((input)=>({...input,description:ev.target.value}))

    }
    else if(ev.target.name==='categorySelect'){
      setInput((input)=>({...input,category:ev.target.value}))
    }

    else if(ev.target.name==='categoryText'){
      setInput((input)=>({...input,categoryText:ev.target.value}))
    }

    }
///////////////////////////////////////////////////////////////////////////////


//////////////// FUNCION QUE HACE EL POST DEL ESTADO INPUT ////////////////////
    async function handleSubmit(e){ 
      e.preventDefault()

      console.log("input",input)

      // checked&&dispatch(CREATECATEGORY(input)).then((r)=>{// crea una nueva categoria
      //    setInput((pepe)=>({...pepe,category:r.payload._id})) //carga el input con el id de la nueva categoria
      //     const newInput={...input,category:r.payload._id}
      //     console.log("newInput con categoria nueva",newInput)

      //     const newInput2={...newInput,imageProduct:images[0]?images:["https://res.cloudinary.com/dnlooxokf/image/upload/v1654057815/images/pzhs1ykafhvxlhabq2gt.jpg"]} // se prepara un objeto con los campos del fomrulario y sus imagenes
      //     dispatch(CREATEPRODUCT(newInput2)).then(async(r)=>{
      //       dispatch(GETPRODUCTS()) //para que cuando vaya al home ya muestre el producto Agregado
      //       console.log("resBack crear producto",r)
      //       if(r.payload==="Se creo el producto exitosamente"){
      //         await swal({title:"Realizado",text:"Se creo el Producto exitosamente!",icon:"success",button:"Aceptar"}).then(()=> {navegar("/")}) 
      //             //window.location.reload()       
      //       }
      //     })
      //   })
    //  console.log("r.payload._id input categoria",r.payload._id)
      console.log("input con categoria nueva",input)
         
      
      if(!checked){
        const newPost={...input,imageProduct:images[0]?images:["https://res.cloudinary.com/dnlooxokf/image/upload/v1654057815/images/pzhs1ykafhvxlhabq2gt.jpg"]} // se prepara un objeto con los campos del fomrulario y sus imagenes
        dispatch(CREATEPRODUCT(newPost)).then(async(r)=>{
          dispatch(GETPRODUCTS()) //para que cuando vaya al home ya muestre el producto Agregado
          console.log("resBack crear producto",r)
          if(r.payload==="Se creo el producto exitosamente"){
            await swal({title:"Realizado",text:"Se creo el Producto exitosamente!",icon:"success",button:"Aceptar"}).then(()=> {navegar("/")}) 
                //window.location.reload()       
          }
        })
      }

      
         //se accede al home
        // window.location.reload();      
  }

  return (
    <div>
        <NavBar/>

        <Box display='flex' justifyContent='center'>
          <div id='formnuevo'>

        <Typography display='flex' justifyContent='center' mt={15}>PUBLICAR ARTICULO</Typography>

          <Box
            display='flex' 
            flexDirection='column'
            margin='auto'
            component="form"
            sx={{
              '& > :not(style)': { m: 1 , width:'70ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="formtitle" label="Nombre" variant="outlined" name='nombre' value={input.nombre}
            onChange={(e)=>validate(e)}/>

            <Box sx={{display:'flex'}}>
            <TextField id="formprecioOrginial" label="Precio " variant="outlined"  name='precio' value={parseFloat(input.precio)} type='number'
                InputProps={{startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                onChange={(e)=>validate(e)} fullWidth
            /> 
            </Box>                     

            <Box>
            <Typography >Agregar Categoria</Typography>
            <Checkbox  onChange={checkBox} inputProps={{ 'aria-label': 'controlled' }}/>
            {checked?

              <TextField label="Nueva categoria" variant="outlined" name='categoryText' value={input.categoryText} onChange={(e)=>validate(e)}></TextField>
            :
                <Select
                display='none'
                  id="formcats"
                  select
                  label="Categorias"
                  value={input.category}
                  onChange={(e)=>validate(e)}
                  name='categorySelect'
                  fullWidth
                >
                  <MenuItem key='select' value='Select'>Select</MenuItem>
                    {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                ))}
                </Select>
            }
            </Box>         
   

            <TextField multiline rows={10} id="formdesc" label="Descripcion" variant="outlined" name='description' value={input.descripcion}
            onChange={(e)=>validate(e)}/>

              <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <Button
                    color="secondary"
                    fullWidth
                    startIcon={ <UploadOutlined /> }
                    onClick={ () => fileInputRef.current?.click() }
                >
                    Cargar imagen
                </Button>
              </Box>


            
            
            {
            <input 
              multiple
              aria-label="Archivo" 
              type="file" name="imagen" 
              onChange={handleUploadImage} 
              ref={ fileInputRef }
              style={{ display: 'none' }}
            />}

              <Container display='flex' flexDirection='row' justifyContent='center' width={10}  >
              <Swiper
                      modules={[Navigation, Pagination, A11y]}
                      spaceBetween={20}
                      slidesPerView={4}
                      navigation={true}
                      loop={false}
                     
                  
                     // pagination={{ clickable: true }}
                    >
                {images[0]?images.map(image=>(
                  <Container>

                    <SwiperSlide>
                      <Link target="_blank" href={image}>
                      <CardMedia
                        Autoplay='false' 
                        component="img"
                        height="250"
                        image={image}
                        alt="gf"
                        sx={{objectFit:'contain',  zIndex: 'modal' }}

                      />
                      </Link>
                    
                      <Box display='flex' justifyContent='center' sx={{ zIndex: 'tooltip' }} onClick={(e)=>{handleDelete(e,image)}}>
                        <Button  color = 'error' >Borrar</Button>
                      </Box>

                    </SwiperSlide>
                   
                   </Container>
                )):<></>}
                </Swiper>
              </Container>
              {upLoading && <p>Subiendo Foto...</p> }

              

            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <Typography display='flex' justifyContent='center'>subiste {images.length} fotos</Typography>
              <Button fullWidth sx={{ mb: 3 }} disabled={input.name===""||input.category==="Select"?true:false||input.price===""}  width="100%" type="submit" onClick={(e) => handleSubmit(e)}>Crear Pubicación</Button>
            </Box>   

          </Box>



        </div>
    </Box>
    </div>
    );
  }