import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CardMedia, IconButton,Box,Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useSelector,useDispatch} from 'react-redux'
import { DELETEFROMWISHLIST, GETWISHLIST } from '../Redux/actions';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import { NavLink, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import {v4 as uuid} from 'uuid'

export default function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  let userLogin=useSelector((state)=>state.rootReducer.usuario)
  let wishlist2=useSelector((state)=>state.rootReducer.wishList)

  const deleteElement=(productId)=>{
    //setWishList((old)=>old.filter((e)=>e._id!==productId))
   // wishlist2.filter((e)=>e._id!==productId)
    dispatch(DELETEFROMWISHLIST({productId:productId}))
    //dispatch(GETWISHLIST())
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div>
      <IconButton key={uuid()} aria-describedby={id} variant="contained" onClick={handleClick} style={{color: 'white'}}>
        <Badge key={uuid()} badgeContent={wishlist2?.length} color="error">
           <FavoriteIcon key={uuid()}/>
        </Badge>
      </IconButton>
      <Popover
        key={uuid()}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {wishlist2&&wishlist2[0]? wishlist2?.map(product=>(
          <>
          <Box key={uuid()} sx={{display:'flex',justifyContent:'space-between'}}>
            <Box key={uuid()} sx={{width:100,marginX:1}}>
              <CardMedia
                key={uuid()}
                component="img"
                height="100"
                width='100'
                image={product?.imagenes[0]}
                alt="gf"
                sx={{objectFit:'contain'}}
                onClick={()=>{navigate(`/product/${product._id}`)}}
              />
            </Box>
            <Box key={uuid()} sx={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',mt:2}} onClick={()=>{navigate(`/product/${product._id}`)}}>
              <Typography key={uuid()} sx={{fontSize:10,maxHeight:50}}>{product.nombre.slice(0,40)}</Typography>
              <Typography key={uuid()} sx={{fontSize:10,maxHeight:50}}>${product.precio}</Typography>
            </Box>

            <IconButton key={uuid()} onClick={()=>deleteElement(product._id)}style={{color: 'red',borderRadius:0}}>
              <FavoriteIcon key={uuid()} />
            </IconButton>
          </Box>
          <Divider key={uuid()}/>
          </>
        ))
        :
          <Box key={uuid()}>
             {(userLogin?.correo)?
            <Typography key={uuid()} sx={{m:2,fontWeight:20}}>No tienes productos en favoritos</Typography>
            :  
            <Typography key={uuid()} sx={{m:2,fontWeight:20}}>Debes iniciar sesión para poder usar Favoritos</Typography>
  
          }
          </Box>
        
        }
      </Popover>
    </div>
  );
}
