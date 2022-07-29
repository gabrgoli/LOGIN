
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPut,
        signIn,
        usuariosDelete,
        usuariosPatch,
        login,
        googleSignin,
        getWishlist,
        addProductToWishlist,
        deleteProductToWishlist,
        getusuariobytoken,
     } = require('../controllers/usuarios');

const router = Router();

//TREAR TODOS LOS USUARIOS
router.get('/', [validarJWT,esAdminRole],usuariosGet );

router.get('/getusuariobytoken',validarJWT, getusuariobytoken );

//MODIFICAR USUARIO
router.put('/modificarusuario/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarJWT,
    validarCampos
],usuariosPut );

//CREAR UN USUARIO, SINGIN
router.post('/',[
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    //check('correo', 'El correo no es válido').isEmail(),
    //check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    //check('rol').custom( esRoleValido ), 
    validarCampos
], signIn );

//ELIMINAR UN USUARIO
router.delete('/:id',[
    validarJWT,
     esAdminRole, //para que el usuario tiene que ser administrador
    //tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'), //puede realizar la accion cualquiera con estos roles
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.patch('/', usuariosPatch );

// LOGIN DE USUARIO
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

// LOGIN CON GOOGLE
router.post('/google',[
   // check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

// OBTENER ARRAY DE PRODUCTOS DE LA WISHLIST
router.get('/wishlist',validarJWT,getWishlist);

// AGREGAR UN PRODUCTO A LA WISHLIST
router.post('/wishlist',validarJWT,addProductToWishlist);

// ELIMINAR UN PRODUCTO DEL ARRAY DE LA WISHLIST
router.put('/wishlist',validarJWT,deleteProductToWishlist);

module.exports = router;