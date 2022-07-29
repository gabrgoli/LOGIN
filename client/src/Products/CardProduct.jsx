import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea,Chip, IconButton,Box,Tooltip } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import{useMemo,useState,useContext} from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ADDTOWISHLIST,DELETEFROMWISHLIST } from '../Redux/actions';
import { useDispatch } from 'react-redux';


//FUNCION PRINCIPAL
export default function ProductCard({product,userLogin=false,wishlist,setWishList}) {
  const [isHovered, setIsHovered] = useState (false);
  const [colorHeart, setColorHeart] = useState ();
  const navigate=useNavigate()
  const dispatch=useDispatch()
    const productImage = useMemo(()=>{
        return product?.imagenes[1]?
        isHovered?
          `${product.imagenes[1]}`
        : `${product.imagenes[0]}`
        : `${product.imagenes[0]}`
         
    },[isHovered,product.imageProduct])


   // CUANDO CAMBIA LA WISHLIST, MAPEA TODOS LOS PRODUCTOS DE LA WISHLIST Y SI COINCIDE CON EL DE CardProduct PINTA DE ROJO EL CORAZÓN
   React.useEffect(()=>{
    setColorHeart(()=>'black')
    wishlist?.forEach((e)=>{
      if(e._id===product._id)setColorHeart(()=>'red')
    })
    },[wishlist])

    const addToWishList = () => { 
      if(colorHeart==="black"){
        setWishList((old)=>[...old,product])
        dispatch(ADDTOWISHLIST({productId:product._id}))
      }
      else{
        setWishList((old)=>old.filter(e=>e._id!==product._id))
        dispatch(DELETEFROMWISHLIST({productId:product._id}))
      } 
    }





  return (
    <Card sx={{ width: {xs:250 ,sm:250},mt:5 }}
    onMouseEnter={()=> setIsHovered(true)}
    onMouseLeave={()=> setIsHovered(false)}
    >
         {/*userLogin&&*/<Tooltip title="Agregar a favoritos" placement="top">
          <IconButton onClick={ addToWishList } style={{color: colorHeart}}>
            <FavoriteIcon />
          </IconButton>
        </Tooltip> } 

      <CardActionArea
      onClick={()=>navigate(`/product/${product._id}`)}
      >

       <CardMedia
            
            component="img"
            height="200"
            image={productImage}
            alt="gf"
            sx={{objectFit:'contain'}}
           />
        <CardContent   sx={{bgcolor:'orange',height:100}}>

            <Tooltip title={product.nombre} placement="top">  
                <Box sx={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',mb:1}}>
                  <Typography gutterBottom variant="h6" sx={{color:'white',fontWeight:'200'}}>
                  {product?.nombre?.slice(0,25)}
                  </Typography>
                  {<Chip label={product.precio} sx={{bgcolor:'gray'}}/>}
                </Box>
            </Tooltip>

            
              <Box>
                      <Typography>${new Intl.NumberFormat().format(product.precio)}</Typography> 
              </Box>
        

        </CardContent>
      </CardActionArea>
    </Card>
  );
}