const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        console.log(errors[0].msg)
        return res.status(400).json(errors[0].msg);

    }

    next();
}



module.exports = {
    validarCampos
}
