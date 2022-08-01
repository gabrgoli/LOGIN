import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Divider,Box, TextField,Rating,FormControlLabel,Switch,FormControl,Select, Container } from '@mui/material';
import {GETCATEGORIES,SEARCHBYCATEGORY,GETPRODUCTS} from '../Redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { maxHeight } from '@mui/system';
import {useLocation, useNavigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid'

export default function FilterByCategory({title}) {
    const [sValue,setSvalue]=React.useState('Todos')
    const location=useLocation()
    const navigate=useNavigate()

    const dispatch=useDispatch()

    React.useEffect(()=>{
        dispatch(GETCATEGORIES())
    },[])
    const categories=useSelector((state)=>state.rootReducer.categorias)

    async function handleFilterCategory(e) {      
      if(e.target.value==="Todos") {
        dispatch(GETPRODUCTS())
        if(location!=='/')navigate('/')
      }
      else{
        dispatch(SEARCHBYCATEGORY(e.target.value))
        if(location!=='/')navigate('/')
      }

      return e.target.value
    }

  return (
    <Box sx={{minWidth:100}}>
        <FormControl fullWidth>
          <Select
            key={uuid()}
            id="demo-simple-select"
            value={sValue}
            onChange={(e) => {
              setSvalue(()=>e.target.value)
              handleFilterCategory(e)
            }}
            name='category'
            sx={{ height:24,bgcolor:'red',fontSize:{xs:11} }}
          >
              <MenuItem key={uuid()} value='Todos' 
                onClick={()=>{
                  dispatch(GETPRODUCTS()) 
                  if(location!=='/')navigate('/')
                }}>
                  {title}
              </MenuItem>
                   {categories.map((category) => (
                    <MenuItem 
                      key={uuid()}
                      name={category.nombre} 
                      value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))} 
          </Select>
        </FormControl>
    </Box>
  );
}