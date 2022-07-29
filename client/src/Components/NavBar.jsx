import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import {Button} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import UploadIcon from '@mui/icons-material/Upload';
import { NavLink,Link, useNavigate } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchBar from './SearchBar'
import FilterCategory from './FilterCategory'
import { Container } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { GETPRODUCTS,SEARCHBYCATEGORY,VERIFYADMIN } from '../Redux/actions';
import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios'
import { Box, Divider, IconButton, ListItem, ListItemIcon, ListItemText,CardMedia } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react";
import { SEARCHBYNAMEPRODUCTS } from '../Redux/actions';
import Cookie from 'js-cookie'
import {api} from '../Redux/actions'
import swal from 'sweetalert';
import WishList from './WishList'

const logo=require('./3TECH.png')

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 30,
  },
}));


export default function PrimarySearchAppBar({isAuthenticated,wishlist,setWishList}) {

  const [isHovered, setIsHovered] = React.useState (false);

  const categories=useSelector((state)=>state.rootReducer.categories)
  //const isAdmin=useSelector((state)=>state.rootReducer.isAdmin)

  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [logged,setLogged]=React.useState(false)


  React.useEffect(()=>{
    dispatch(VERIFYADMIN())
  },[isAuthenticated])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 70,
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      {isAuthenticated&&<ListItem    /// IR A MI PERFIL
          button
          onClick={ () => navigate('/profile') }>
          <ListItemIcon>
             <AdminPanelSettings/>
          </ListItemIcon>
          <ListItemText primary={'Mi perfil'} />
        </ListItem>}


        {isAuthenticated&&<ListItem //BOTON SALIR LOGOUT
          button
          onClick={ () => {
            Cookie.set('user',JSON.stringify([]))//pone en blanco al usuario n cookies
            Cookie.remove('token')
            // logout({ returnTo: window.location.origin })
          }}>
          <ListItemIcon>
              <VpnKeyOutlined/>
          </ListItemIcon>
          <ListItemText primary={'Salir'} />
        </ListItem>}

      
    </Menu>
  );
  
  return (
  <>
        
          <Container sx={{ flexGrow: 1, zIndex: 'tooltip'}} position="fixed" top='0px'>
            <AppBar sx={{bgcolor:'blue'}} >
              <StyledToolbar sx={{justifyContent:'space-between',alignItems:'center',height:30,mt:1}}>
                
                <Box>
                    <Link to='/'>
                      <CardMedia 
                        image={logo}
                        component='img'
                        sx={{width: 100, height: 80, objectFit:'contain'}}
                        onClick={()=>dispatch(GETPRODUCTS())}
                        />                          
                    </Link>
                </Box>

                <Box display={{xs:'none', sm:'flex'}} sx={{position:'absolute',top:10,left:'20vw',zIndex:1100}} flexDirection='row' alignItems='center'>
                  <CardMedia
                    image={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png"}
                    component='img'
                    sx={{width:40}}
                  />
                  <Typography variant='body2'>(USD)</Typography>   
                </Box>



                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <SearchBar 
                  placeholder="Buscar por producto o categoria"
                  url='/'
                  dinamic={false}
                  action={SEARCHBYNAMEPRODUCTS}
                  />
                </Box>

      
              
                <Box sx={{display:'flex',alignItems:'center', justifyContent:'flex-end'}}>
                    {/* WISHLIST */}
                    {<WishList wishlist={wishlist} setWishList={setWishList}/>}
                    {/* BOTON DE LOGIN O DE CUENTA */}
                  <Box sx={{ display: { md: 'flex' } }}>
                    {isAuthenticated?
                    //SI ESTA LOGEADO , BOTON DE CUENTA DE USUARIO
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      {/* <Avatar alt={user?.name} src={user?.avatar||user?.picture} /> */}
                    </IconButton>
                    :
                    // SINO ESTA LOGEADO, BOTON PARA LOGIN
                    <Button sx={{bgcolor:'blue',color:'black',ml:2}} onClick={()=>navigate('/')}>
                      Login
                    </Button>}
                  </Box>
                </Box>


                
              </StyledToolbar>

              <Divider sx={{bgcolor:'blue',m:1}}/>
              

              <Box sx={{display:'flex',justifyContent:'center',mb:1,alignItems:'center'}}>
                <Typography variant='body2' sx={{mr:2}}>Categorias: </Typography>
                  <FilterCategory title={'Todos'}/>
                <Divider orientation="vertical" flexItem sx={{display:{xs:'none',md:'flex'},bgcolor:'white',marginX:1}}/>
                    <Box sx={{display:{xs:'none',md:'flex'},flexDirection:'row'}}>
                      {/* {categories.slice(0,4).map((category)=>(
                      <>
                          <Button key={category._id} onClick={()=>{dispatch(SEARCHBYCATEGORY(category._id)); navigate('/') }}>
                            <Typography key={category._id+1} variant='body2' sx={{color:'white',fontWeight:20}}>{category.name}</Typography>
                          </Button>
                        <Divider key={category._id+2} orientation="vertical" variant='middle'flexItem sx={{bgcolor:'white',marginX:1}}/>
                      </>               
                    ))} */}
                    </Box>
              </Box>

            </AppBar>
            {renderMenu}
          </Container>
    </>
  );
}