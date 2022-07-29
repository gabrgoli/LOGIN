const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        // Verificar si el usuario existe
        if ( !usuario ) {return res.status(400).json({ msg: 'No existe el usuario'});}
        // SI el usuario está activo
        if ( !usuario.estado ) { return res.status(400).json({ msg: 'Usuario Bloqueado - estado: false'});}
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {return res.status(400).json({msg: 'Usuario o Password no son correctos'});}
        // Generar el JWT
        const token = await generarJWT( usuario.id );
        console.log("ok")
        res.json({
            usuario,
            token,
            msg: 'login correcto ok'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador Funcion Login'
        });
    }   

}

const signIn = async(req, res = response) => {
    
    let { nombre, correo, password, rol } = req.body;
    if(!rol){rol='USER_ROLE'}
    const usuario = new Usuario({ nombre, correo, password, rol });
    // Nombre no puede ser vacio
    if ( !nombre ) {return res.status(400).json({ msg: 'El nombre no puede ser vacío'});}
     // Nombre no puede ser vacio
    if ( !password ) {return res.status(400).json({msg: 'El password no puede ser vacío1'});}
    // Nombre no puede ser vacio
    if ( !correo ) {return res.status(400).json({ msg: 'El correo no puede ser vacío'});}
    // Verificar si el usuario existe
    const user = await Usuario.findOne({ correo });
    if ( user ) { return res.status(400).json({ msg: 'Ya existe un usuario con ese correo'});}
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt );
    // Guardar en BD
    await usuario.save();
    // Respuesta
    res.json({
        msg: "se creo el usuario exitosamente",
        usuario
    });
}



const googleSignin = async(req, res = response) => {
    
    const { id_token } = req.body;
    console.log("hola",id_token)
    try {
        const { correo, nombre, img } = await googleVerify( id_token );
        //Busco usuario en la base de datos
        let usuario = await Usuario.findOne({ correo: correo });
        // SI USUARIO NO ESTA EN BDD LO CREO Y LO GUARDO
        if ( !usuario ) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario( data );
            //GUARDA EL USUARIO EN LA BASE DE DATOS
            await usuario.save();
        }
        // Si el usuario esta Bloqueado
        if ( !usuario.estado ) { return res.status(401).json({msg: 'Hable con el administrador, usuario bloqueado'});}
        // Si esta todo OK, se genera el JWT
        console.log("usuario",usuario)
        const token = await generarJWT( usuario._id );
        res.json({
            msg: "googleLogin Correcto",
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido!!!'
        })

    }
}


const usuariosGet = async(req = request, res = response) => {

    const { limite , desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}


const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) { //si viene password es porque quiere actualizar la contraseña
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}


// TRAE TODOS LOS PRODUCTOS DE LA WISHLIST
const getWishlist = async (req, res, next) => {

    // const { id } = req.params;
    // if(id){req.userId=id}

    try {
        if(!req.usuario.wishList){const usuario = await Usuario.findByIdAndUpdate( req.userId, {wishList:[]})}
        

        const UserById=await Usuario.findById(req.userId).populate('wishList')
        
        res.status(200).json(UserById.wishList?UserById.wishList:[])
    } catch (error) {
        next(error)
    }
};

// AGREGA UN PRODUCTO A LA WISHLIST
const addProductToWishlist = async (req, res, next) => {
    try {
        const {productId}=req.body
        const producto=await Producto.findById(productId)
        const updatedUser=await Usuario.findByIdAndUpdate(
            req.userId,
            {$addToSet: {"wishList": producto._id}},//addtoSet no agrega otro elemento si ya existe en el array
            {upsert: true, new : true}).populate('wishList');
        
        res.status(200).json(updatedUser.wishList)
    } catch (error) {
        next(error)
    }
};


//ELIMINA PRODUCTO DE LA WISHLIST, CON EL ID
const deleteProductToWishlist = async (req, res, next) => {
    try {
        const {productId}=req.body
        const producto=await Producto.findById(productId)
        const updatedUser=await Usuario.findByIdAndUpdate(
            req.userId,
            {$pull: {"wishList": producto._id}},//pull elimina un objeto que matchee
            {upsert: true, new : true}).populate('wishList');
        
        res.status(200).json(updatedUser.wishList)
    } catch (error) {
        next(error)
    }
};

const getusuariobytoken=async(req,res,next)=>{
    try{
        const user=req.usuario
        res.status(200).json(user)
    }catch(error){
        next(error)
    }
};




module.exports = {
    usuariosGet,
    signIn,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    login,
    googleSignin,
    deleteProductToWishlist,
    addProductToWishlist,
    getWishlist,
    getusuariobytoken,
}
