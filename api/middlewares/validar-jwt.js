const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

   // console.log('token',token)

    try {

    if ( !token||token===undefined ) {
        return res.status(401).json({msg: 'No hay token en la petición'});
        //return res.status(401).json([]);
    }

    // creo un comodin para usar el token siempre
    if ( token==='123456789' ) {
        req.userId = '62d9452aa91125725841a698' //le paso usuario1@gmail.com ADMIN_ROLE
        //req.userId = '62d945a3a91125725841a69a' //le paso usuario1@gmail3.com es USER_ROLE
        const user = await Usuario.findById(req.userId)
        //console.log('usuario mostrar', user)
        if (!user) return res.status(404).json({ msg: 'User Not Found' })
       //if (!user) return res.status(404).json([])
        req.usuario = user;
        return next();
    }   
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        //if( !usuario ) {return res.status(401).json({msg: 'Token no válido - usuario no existe DB'})}
        if( !usuario )return res.status(401).json([]);

        // Verificar si el uid tiene estado true para poder logearse
        if ( !usuario.estado ) {
            return res.status(401).json(
                {msg: 'Token no válido - usuario con estado: false' }
                //[]
           )
        }
        
        req.userId=uid;
        req.usuario = usuario;
        next();

    } catch (error) {

       // console.log(error);
        res.status(401).json(
            {msg: 'Token no válido' }
            //[]
       )
    }

}




module.exports = {
    validarJWT
}