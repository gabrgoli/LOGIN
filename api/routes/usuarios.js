
const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos,validarJWT,esAdminRole,tieneRole} = require('../middlewares');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const emailer = require("../nodeMailer/emailer")
const jwt = require('jsonwebtoken');

const passport = require('passport')

//const { usuariosGet,usuariosPut, signIn, usuariosDelete,usuariosPatch, login, googleSignin,getWishlist, addProductToWishlist,deleteProductToWishlist, getusuariobytoken,} = require('../controllers/usuarios');

const router = Router();



//

router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
           cookies: req.cookies
      });
    }
  });


router.get("/github", passport.authenticate("github", { scope: ["accessToken"] }));
router.get("/github/callback",passport.authenticate("github", {
    successRedirect: `http://localhost:3000/home`,
    failureRedirect: "http://localhost:3000/",
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));
router.get("/facebook/callback",passport.authenticate("facebook", {
    successRedirect: `http://localhost:3000/home`,
    failureRedirect: "/login/failed",
  })
);

router.get("/instagram", passport.authenticate("instagram"));
router.get("/instagram/callback",passport.authenticate("instagram",{
    successRedirect: `http://localhost:3002/home`,
    failureRedirect: "http://localhost:3002/",
})
);




// TRAER TODOS LOS USUARIOS
router.get('/', [validarJWT,esAdminRole],async(req = request, res = response) => {

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
} );

// GET USUARIO
router.get('/getusuariobytoken',validarJWT, async(req,res,next)=>{
    try{
        const user=req.usuario
        res.status(200).json(user)
    }catch(error){
        next(error)
    }
} );


// ENVIAR MAIL DE CONFIRMACION
router.post('/enviomail',async(req, res = response) => {
    const { correo } = req.body;
    const usuario = await Usuario.findOne({ correo });

    if ( !usuario ) { return res.status(400).json({ msg: 'No existe el usuario'});}
    if ( usuario.google ) { return res.status(400).json({ msg: 'Usuario de google!!'});}
    
    const token = await generarJWT( usuario._id );

    emailer.sendMail(usuario,token)

    res.json({usuario,msg: "se envió un mail a tu correo"});
} );

// EDITAR UN USUARIO
router.put('/modificarusuario/:id',[
    //check('id', 'No es un ID válido').isMongoId(),
    //check('id').custom( existeUsuarioPorId ),
    //check('rol').custom( esRoleValido ), 
    validarJWT,
    esAdminRole,
    validarCampos
],async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) { //si viene password es porque quiere actualizar la contraseña
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    await Usuario.findByIdAndUpdate( id, resto );
    const usuario = await Usuario.findById( id );
    res.json({usuario,msg:"se modificaron los datos del usuario exitosamente"});
} );

// CAMBIAR CONTRASEÑA
router.put('/passwordchange',async(req, res = response) => {

        //const { id } = req.params;
        const {password, tokenId} = req.body;
    try{
        if ( !password ) {return res.status(400).json({msg: 'El password no puede ser vacío'});}
        //encriptar password
        const salt = bcryptjs.genSaltSync();
        const NewPassword = bcryptjs.hashSync( password, salt );
        // desencriptar token y extraer el id de usuario
        const  {uid}  = jwt.verify( tokenId, process.env.SECRETORPRIVATEKEY );
        //buscar el usuario
        const user = await Usuario.findById(uid);
        //si no encuentra usuario
        if ( !user ) { return res.status(400).json({ msg: 'Token no válido'});}
        // si encuentra usuario, lo actualza y lo busca de nnuevo para traerlo actualizado
        await Usuario.findByIdAndUpdate( uid, {password:NewPassword} );
        const usuario = await Usuario.findById( uid );

        res.json({usuario,msg:"se cambio la contraseña exitosamente!!!!"});
    }catch(error){
        return res.status(400).json({ msg: 'Token no válido!!!!!'});
    }

})

// CREAR UN NUEVO USUARIO , SINGIN
router.post('/',[
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    //check('correo', 'El correo no es válido').isEmail(),
    //check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //check('rol').custom( esRoleValido ), 
    validarCampos
], async(req, res = response) => {
    
    let { nombre, correo, password, rol } = req.body;
    if(!rol){rol='USER_ROLE'}
    const usuario = new Usuario({ nombre, correo, password, rol });
    // Nombre no puede ser vacio
    if ( !nombre ) {return res.status(400).json({ msg: 'El nombre no puede ser vacío'});}
     // password no puede ser vacio
    if ( !password ) {return res.status(400).json({msg: 'El password no puede ser vacío1'});}
    // correo no puede ser vacio
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
} );

// ELIMINA UN USUARIO, PONIENDO ESTADO EN FALSE
router.delete('/:id',[
    validarJWT,
     esAdminRole, //para que el usuario tiene que ser administrador
    //tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'), //puede realizar la accion cualquiera con estos roles
   // check('id', 'No es un ID válido').isMongoId(),
   // check('id').custom( existeUsuarioPorId ),
   // validarCampos
],usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
} );

// LOGIN DE USUARIO
router.post('/login',[
    //check('correo', 'El correo es obligatorio').isEmail(),
    ///check('password', 'La contraseña es obligatoria').not().isEmpty(),
    //validarCampos
],async(req, res = response) => {

    const { correo, password } = req.body;
    try {
        if ( !correo ) {return res.status(400).json({ msg: 'El correo no puede estar vacío'});}
        if ( !password ) {return res.status(400).json({ msg: 'El password no puede estar vacío'});}
        
        const usuario = await Usuario.findOne({ correo });
        // Verificar si el usuario existe
        if ( !usuario ) {return res.status(400).json({ msg: 'No existe el usuario'});}
        // SI el usuario está activo
        if ( !usuario.estado ) { return res.status(400).json({ msg: 'Usuario Bloqueado - estado: false'});}
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {return res.status(400).json({msg: 'Usuario o Password no son correctos'});}
        // Generar el JWT
        const token = await generarJWT( usuario._id );
        console.log(usuario)
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

} );

// LOGIN CON GOOGLE
router.post('/google',[
   // check('id_token', 'El id_token es necesario').not().isEmpty(),
    //validarCampos
], async(req, res = response) => {
    
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
                password: 'SAPOPEPE',
                img,
                google: true
            };
            usuario = new Usuario( data );
            //GUARDA EL USUARIO EN LA BASE DE DATOS
            await usuario.save();
        }
        // SI USUARIO ESTA EN LA BDD
        // Si esta Bloqueado
        if ( !usuario.estado ) { return res.status(401).json({msg: 'Hable con el administrador, usuario bloqueado'});}
        // Si esta todo OK, se genera el JWT
        //console.log("usuario",usuario)
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
} );

// GET ARRAY DE PRODUCTOS  WISHLIST
router.get('/wishlist',validarJWT,async (req, res, next) => {
        // const { id } = req.params;
        // if(id){req.userId=id}
        if(req.usuario.nombre==='invitado'){res.status(200).json([])}
    try {
        if(!req.usuario.wishList){const usuario = await Usuario.findByIdAndUpdate( req.userId, {wishList:[]})}
        

        const UserById=await Usuario.findById(req.userId).populate('wishList')
        
        res.status(200).json(UserById.wishList?UserById.wishList:[])
    } catch (error) {
        // next(error)
        []
    }
});

// AGREGAR UN PRODUCTO A LA WISHLIST
router.post('/wishlist',validarJWT,async (req, res, next) => {
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
});

// ELIMINAR UN PRODUCTO DEL ARRAY DE LA WISHLIST
router.put('/wishlist',validarJWT,async (req, res, next) => {
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
});

module.exports = router;