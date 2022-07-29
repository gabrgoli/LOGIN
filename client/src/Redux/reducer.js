import { createReducer } from '@reduxjs/toolkit'
import * as actions from './actions'
import Cookie from 'js-cookie'


const initialState = {
  productos:[],
  detail:[],
  categorias:[],
  usuarios:[],
  isAdmin:false,
  usuario:[],
  productReviews:[], //reviews de un producto especifico
  wishList:[],
}

const OrderByPrice=(state,action)=>{  //Ordenar por precio mayor a menos Funcion
        const sortedProductsByPrice =
          action.payload === "precioMax"
            ? state.productos.sort(function (a, b) {
                if (a.precio < b.precio) {
                  return 1;
                }
                if (b.precio < a.precio) {
                  return -1;
                }
                return 0;
              })
            : state.productos.sort(function (a, b) {
                if (a.precio < b.precio) {
                  return -1;
                }
                if (b.precio < a.precio) {
                  return 1;
                }
                return 0;
              });

        return sortedProductsByPrice
}


const rootReducer = createReducer(initialState, (builder) => {
  builder

  .addCase(actions.USERISLOGIN.fulfilled, (state, action) => {
    state.usuario=action.payload
  })

    .addCase(actions.GETPRODUCTS.fulfilled, (state, action) => {
      state.productos=[]
      state.productos=action.payload
    })
    .addCase(actions.GETCATEGORIES.fulfilled, (state, action) => {
      state.categorias=action.payload
    })

    .addCase(actions.GETPRODUCT.fulfilled, (state, action) => {
      state.detail=[]
      state.detail=action.payload
    })

    .addCase(actions.SEARCHBYNAMEPRODUCTS.fulfilled, (state, action) => {
      state.productos=[]
      state.productos=action.payload
    })

    .addCase(actions.SEARCHBYCATEGORY.fulfilled, (state, action) => {
      state.productos=[]
      state.productos=action.payload 
    })
    .addCase(actions.ORDERBYPRICE, (state, action) => {
      const sortedProductsByPrice = OrderByPrice(state,action)
      state.productos=[]
      state.productos=sortedProductsByPrice
    })

    .addCase(actions.GETUSERS.fulfilled, (state, action) => {
        state.usuarios=action.payload
    })
                        
    .addCase(actions.SEARCHBYNAMEUSERS.fulfilled, (state, action) => {
      //state.users=[]
      state.usuarios=action.payload
    })
    .addCase(actions.VERIFYADMIN.fulfilled, (state, action) => {
      state.isAdmin=action.payload
    })

    .addCase(actions.MODIFYUSER.fulfilled,(state,action)=>{
      if(action.payload!=='ok'){//si el usuario que tengo en cookies actualmente es igual al que modifique, modifica las cookies
      
        Cookie.set('user',JSON.stringify( action.payload ),{expires:0.08})
      }
    })

    .addCase(actions.GETWISHLIST.fulfilled, (state, action) => {
      state.wishList=action.payload
    })



})
export default rootReducer