const express = require('express');
const cors = require('cors');
const morgan=require('morgan')
const { dbConnection } = require('../database/config');

const usuarios = require('../routes/usuarios')
const productos = require('../routes/productos')
const categorias = require('../routes/categorias')
const buscar = require('../routes/buscar')


class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // muestra las reutas cuando se hace un request
        this.app.use(morgan('dev'));

    }

    routes() {
        
        this.app.use( '/api/buscar', buscar);
        this.app.use( '/api/categorias', categorias);
        this.app.use( '/api/productos', productos);
        this.app.use( '/api/usuarios', usuarios);
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
